import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const workbook = new ExcelJS.Workbook();
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'shikko_template.xlsx');

    try {
      // テンプレートが存在する場合は読み込む
      if (fs.existsSync(templatePath)) {
        await workbook.xlsx.readFile(templatePath);
      } else {
        // テンプレートが存在しない場合はモック作成
        const sheet = workbook.addWorksheet('精算書');
        sheet.getCell('A1').value = '出張精算書 (モック)';
        sheet.getCell('A3').value = '種類:';
        sheet.getCell('A4').value = '出張日:';
        sheet.getCell('A5').value = '目的地:';
        sheet.getCell('A6').value = '総距離:';
        sheet.getCell('A7').value = 'ETC料金:';
        sheet.getCell('A8').value = '休日手当:';
      }
    } catch (err) {
      console.warn("Failed to load template, using mock instead", err);
      // フォールバック
      if (workbook.worksheets.length === 0) {
        workbook.addWorksheet('精算書');
      }
    }

    const worksheet = workbook.worksheets[0];

    // データの書き込み（セル位置はモックベース）
    worksheet.getCell('E6').value = data.date || ''; // 出張日
    worksheet.getCell('Q6').value = data.destinations || ''; // 目的地
    worksheet.getCell('E7').value = data.totalDistance || 0; // 距離
    worksheet.getCell('E8').value = data.etcFee || 0; // ETC料金
    worksheet.getCell('E9').value = data.holidayAllowance || 0; // 休日手当

    // チェックボックスの表現
    if (data.type === 'shikko') {
      worksheet.getCell('C3').value = '☑ 執行委員会';
      worksheet.getCell('G3').value = '□ 職場訪問';
    } else if (data.type === 'visit') {
      worksheet.getCell('C3').value = '□ 執行委員会';
      worksheet.getCell('G3').value = '☑ 職場訪問';
    } else {
      worksheet.getCell('C3').value = '□ 執行委員会';
      worksheet.getCell('G3').value = '□ 職場訪問';
    }

    // Bufferとして書き出し
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="seisan.xlsx"',
      },
    });

  } catch (error) {
    console.error('Excel Export Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel file' },
      { status: 500 }
    );
  }
}
