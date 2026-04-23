import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: Request) {
  try {
    const data = await req.json(); // フロントから送られてくるレポートデータ

    // テンプレートファイルのパス（public/templates/ に配置されている前提）
    const templatePath = path.join(process.cwd(), 'public/templates/shikko_template.xlsx');

    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile(templatePath);
    } catch (error) {
      console.warn("テンプレートが見つかりませんでした。空のモックを作成します。", error);
      const sheet = workbook.addWorksheet('精算書');
      sheet.getCell('A1').value = 'テンプレートが配置されていません';
    }

    const worksheet = workbook.worksheets[0];

    // 📝 データの流し込み（セル位置は後で調整します）
    if (worksheet && data) {
      worksheet.getCell('B2').value = data.created_at;
      worksheet.getCell('C4').value = data.destinations;
      worksheet.getCell('D6').value = data.etc_fee;
      worksheet.getCell('E6').value = data.travel_allowance || data.allowance; // Adjusting for the actual schema property
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="seisan_${data.id || 'export'}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Excel生成エラー:', error);
    return NextResponse.json({ error: 'Excelの生成に失敗しました' }, { status: 500 });
  }
}
