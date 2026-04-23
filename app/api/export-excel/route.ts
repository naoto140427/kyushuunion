import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: Request) {
  try {
    const data = await req.json(); // フロントから送られてくるレポートデータ

    // レポートの種類（shikko / shokuho）に応じてテンプレートとマッピングを切り替える
    const isShikko = data.type === 'shikko';
    const templateFileName = isShikko ? 'shikko_template.xlsx' : 'shokuho_template.xlsx';
    const templatePath = path.join(process.cwd(), 'public/templates', templateFileName);

    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile(templatePath);
    } catch (error) {
      console.warn("テンプレートが見つかりませんでした。空のモックを作成します。", error);
      const sheet = workbook.addWorksheet('精算書');
      sheet.getCell('A1').value = 'テンプレートが配置されていません';
    }

    const worksheet = workbook.worksheets[0];

    // セル番地のマッピング定義（結合セル等に合わせて後で微調整します）
    const cellMap: Record<string, string> = isShikko ? {
      // 執行委員会用のマッピング
      dateYear: 'T1',       // 作成日（年）
      dateMonth: 'X1',      // 作成日（月）
      dateDay: 'Z1',        // 作成日（日）
      destination: 'P6',    // 出張先
      distance: 'N15',      // 自家用車 走行距離合計(往復)
      allowance: 'W15',     // 自家用車 金額
      etcFee: 'W17',        // 有料道路 金額
      etcRoute: 'F18',      // 有料道路 経路
      userName: 'F34'       // 氏名
    } : {
      // 職場訪問用のマッピング
      dateYear: 'T1',
      dateMonth: 'X1',
      dateDay: 'Z1',
      dest1: 'O6',          // 出張先①
      dest2: 'U6',          // 出張先②
      dest3: 'AA6',         // 出張先③
      distance: 'N13',      // 自家用車 走行距離合計(往復)
      allowance: 'W13',     // 自家用車 金額
      etcFee: 'W15',        // 有料道路 金額
      userName: 'F32'       // 氏名
    };

    // 📝 データの流し込み実行
    if (worksheet && data) {
      // 申請日を年・月・日に分割して挿入
      if (data.created_at || data.date) {
        const date = new Date(data.created_at || data.date);
        worksheet.getCell(cellMap.dateYear).value = date.getFullYear();
        worksheet.getCell(cellMap.dateMonth).value = date.getMonth() + 1;
        worksheet.getCell(cellMap.dateDay).value = date.getDate();
      }

      // 共通項目の挿入
      worksheet.getCell(cellMap.distance).value = data.total_distance;
      worksheet.getCell(cellMap.allowance).value = data.travel_allowance || data.allowance;
      worksheet.getCell(cellMap.etcFee).value = data.etc_fee;
      if (data.user_name) worksheet.getCell(cellMap.userName).value = data.user_name;

      // タイプごとの固有項目の挿入
      if (isShikko) {
        worksheet.getCell(cellMap.destination).value = typeof data.destinations === 'string' ? data.destinations : JSON.stringify(data.destinations);
        // 必要に応じてETC経路なども挿入可能
      } else {
        // 職場訪問の場合は、カンマ区切り等で保存された目的地を分割して挿入（仮実装）
        let dests: string[] = [];
        if (typeof data.destinations === 'string') {
          dests = data.destinations.split(',');
        } else if (Array.isArray(data.destinations)) {
          dests = data.destinations;
        }

        if (dests[0]) worksheet.getCell(cellMap.dest1).value = dests[0].trim();
        if (dests[1]) worksheet.getCell(cellMap.dest2).value = dests[1].trim();
        if (dests[2]) worksheet.getCell(cellMap.dest3).value = dests[2].trim();
      }
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
