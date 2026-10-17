import AppKit
import Foundation

enum Layout: String {
    case hero
    case center
    case split
    case vertical
    case grid
    case list
    case equation
    case cascade
}

struct Card {
    let number: Int
    let slug: String
    let cue: String
    let seconds: Double
    let layout: Layout
    let lines: [String]
    let accent: Set<Int>
}

let cards: [Card] = [
    Card(number: 1, slug: "deliberate-practice", cue: "我现在越来越觉得", seconds: 5, layout: .vertical, lines: ["交易", "也需要\n刻意练习"], accent: [0]),
    Card(number: 2, slug: "review-is-essential", cue: "我们在网上经常能看到", seconds: 5, layout: .center, lines: ["做交易", "一定要复盘"], accent: [1]),
    Card(number: 3, slug: "how-to-review", cue: "但到底该怎么复盘", seconds: 5, layout: .vertical, lines: ["复盘", "到底该怎么做？"], accent: [0]),
    Card(number: 4, slug: "replay-buy-sell", cue: "难道只是把历史行情", seconds: 8, layout: .split, lines: ["重新播放行情", "这里买 · 那里卖"], accent: [1]),
    Card(number: 5, slug: "understood-next-time", cue: "如果只是这样的话", seconds: 8, layout: .cascade, lines: ["这个行情\n我看懂了", "这个位置\n下次一定能抓住？"], accent: [1]),
    Card(number: 6, slug: "same-mistakes", cue: "可是真正到了实时行情里", seconds: 8, layout: .center, lines: ["真到了实时行情", "还是会犯同样的错"], accent: [1]),
    Card(number: 7, slug: "not-the-same", cue: "所以我觉得", seconds: 7, layout: .equation, lines: ["重看行情", "复盘", "刻意练习"], accent: [2]),
    Card(number: 8, slug: "tried-a-lot", cue: "我自己为了复盘这件事", seconds: 5, layout: .center, lines: ["为了复盘", "我也折腾过不少"], accent: [1]),
    Card(number: 9, slug: "tools-list", cue: "Soft4FX我买过", seconds: 10, layout: .list, lines: ["Soft4FX", "盘立方 · 同花顺 · 复盘大师", "TradingView"], accent: [0, 2]),
    Card(number: 10, slug: "programmatic-trading", cue: "我也写过程序化交易", seconds: 9, layout: .split, lines: ["交易理念", "写成代码"], accent: [1]),
    Card(number: 11, slug: "tools-bad", cue: "是这些工具不好吗", seconds: 6, layout: .equation, lines: ["是工具不好吗？", "也不是"], accent: [1]),
    Card(number: 12, slug: "still-missing", cue: "它们都有自己擅长的地方", seconds: 8, layout: .center, lines: ["各有所长", "但离我想要的复盘\n还差一点"], accent: [1]),
    Card(number: 13, slug: "disconnected", cue: "比如说，有些软件可以回放行情", seconds: 11, layout: .grid, lines: ["交易系统", "入场理由", "风险规则", "交易记录"], accent: [0, 1, 2, 3]),
    Card(number: 14, slug: "which-rule", cue: "我可以在里面下单", seconds: 9, layout: .split, lines: ["我按哪条规则做的？", "有没有违反系统？"], accent: [1]),
    Card(number: 15, slug: "programmatic-problem", cue: "程序化交易也有它的问题", seconds: 5, layout: .center, lines: ["程序化交易", "也有它的问题"], accent: [1]),
    Card(number: 16, slug: "objective-subjective", cue: "如果规则非常明确", seconds: 12, layout: .split, lines: ["指标 · 参数\n可以写成代码", "环境 · 结构 · 状态\n带着主观判断"], accent: [1]),
    Card(number: 17, slug: "if-then", cue: "这些东西多少都会带一点主观判断", seconds: 8, layout: .vertical, lines: ["判断", "很难全部写成\nIF · THEN"], accent: [0]),
    Card(number: 18, slug: "patience", cue: "还有一个问题", seconds: 6, layout: .center, lines: ["复盘这件事", "真的很磨耐心"], accent: [1]),
    Card(number: 19, slug: "years-of-data", cue: "我以前也经常给自己定计划", seconds: 9, layout: .split, lines: ["我要把几年的行情", "全部复盘完"], accent: [1]),
    Card(number: 20, slug: "attention-drift", cue: "但做着做着", seconds: 10, layout: .cascade, lines: ["刚开始\n动力很足", "做着做着\n注意力跑掉了", "后来\n就放在那里"], accent: [1, 2]),
    Card(number: 21, slug: "repetitive-organizing", cue: "不是我觉得复盘没有用", seconds: 9, layout: .split, lines: ["过程太重复", "整理的东西太多"], accent: [1]),
    Card(number: 22, slug: "replay-not-finished", cue: "因为行情回放完了", seconds: 6, layout: .equation, lines: ["行情回放结束", "复盘结束"], accent: [1]),
    Card(number: 23, slug: "trade-records", cue: "你还要整理每一笔交易", seconds: 11, layout: .grid, lines: ["为什么进场", "有没有遵守系统", "哪些错误", "一直在重复"], accent: [0, 1, 2, 3]),
    Card(number: 24, slug: "excel-screenshots", cue: "有人甚至用Excel表格", seconds: 13, layout: .list, lines: ["Excel表格", "截图 · 命名 · 分类", "放在一起比较"], accent: [0, 2]),
    Card(number: 25, slug: "time-consuming", cue: "想法很好", seconds: 6, layout: .center, lines: ["想法很好", "做起来真的很费时间"], accent: [1]),
    Card(number: 26, slug: "not-repetition", cue: "后来我慢慢想明白了一件事", seconds: 10, layout: .equation, lines: ["刻意练习", "机械重复"], accent: [0]),
    Card(number: 27, slug: "practice-pillars", cue: "它应该有一个明确的目标", seconds: 12, layout: .grid, lines: ["明确目标", "具体规则", "哪里做对", "哪里出错"], accent: [0, 1, 2, 3]),
    Card(number: 28, slug: "review-should-be", cue: "交易复盘其实也应该是这样", seconds: 6, layout: .center, lines: ["交易复盘", "也应该是一种刻意练习"], accent: [1]),
    Card(number: 29, slug: "why-tradereplay", cue: "这也是我后来做TradeReplay的原因", seconds: 7, layout: .hero, lines: ["这就是我做", "TradeReplay", "的原因"], accent: [1]),
    Card(number: 30, slug: "not-player", cue: "我不是想再做一个", seconds: 9, layout: .split, lines: ["不只是\n播放 · 暂停 · 拖动K线", "而是把交易系统\n放进复盘过程"], accent: [1]),
    Card(number: 31, slug: "complete-process", cue: "开始训练之前", seconds: 16, layout: .grid, lines: ["训练前｜选择系统", "行情中｜检查条件", "交易时｜理由与风险", "结束后｜检查偏差"], accent: [0, 1, 2, 3]),
    Card(number: 32, slug: "compare-differences", cue: "等交易积累起来以后", seconds: 11, layout: .grid, lines: ["不同系统", "不同市场环境", "不同执行方式", "比较差异"], accent: [0, 1, 2, 3]),
    Card(number: 33, slug: "no-promises", cue: "它当然不会告诉你", seconds: 9, layout: .split, lines: ["不预测下一段行情", "不保证你一定赚钱"], accent: []),
    Card(number: 34, slug: "simple-purpose", cue: "它做的事情其实很朴素", seconds: 12, layout: .grid, lines: ["更容易坚持", "留下交易记录", "检查每次执行", "真正看到问题"], accent: [0, 1, 2, 3]),
    Card(number: 35, slug: "skip-installation", cue: "所以这一集", seconds: 9, layout: .split, lines: ["不先讲安装", "不逐个介绍菜单"], accent: []),
    Card(number: 36, slug: "full-training", cue: "我会直接做一次完整的训练", seconds: 9, layout: .hero, lines: ["直接做一次", "完整训练", "带着交易系统复盘"], accent: [1, 2]),
]

let canvasSize = NSSize(width: 3840, height: 2160)
let sourceDir = URL(fileURLWithPath: #filePath).standardizedFileURL.deletingLastPathComponent()
let root = sourceDir.deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent()
let episodeDir = ProcessInfo.processInfo.environment["TR_BILIBILI_OUTPUT_DIR"]
    .map { URL(fileURLWithPath: $0, isDirectory: true) }
    ?? root.appendingPathComponent("_local/bilibili/episode-01")
let outputDir = episodeDir.appendingPathComponent("intro-cards")
let backgroundURL = sourceDir.deletingLastPathComponent().appendingPathComponent("cover-maker/tradereplay-cover-background.png")

guard let background = NSImage(contentsOf: backgroundURL) else {
    fatalError("Cannot load background at \(backgroundURL.path)")
}

try FileManager.default.createDirectory(at: outputDir, withIntermediateDirectories: true)

let ink = NSColor(calibratedRed: 244/255, green: 247/255, blue: 252/255, alpha: 1)
let inkSoft = NSColor(calibratedRed: 214/255, green: 221/255, blue: 233/255, alpha: 1)
let body = NSColor(calibratedRed: 167/255, green: 178/255, blue: 195/255, alpha: 1)
let primary = NSColor(calibratedRed: 75/255, green: 131/255, blue: 247/255, alpha: 1)
let cyan = NSColor(calibratedRed: 50/255, green: 190/255, blue: 208/255, alpha: 1)
let canvas = NSColor(calibratedRed: 7/255, green: 11/255, blue: 19/255, alpha: 1)

func font(_ size: CGFloat, weight: NSFont.Weight = .semibold) -> NSFont {
    if let pingFang = NSFont(name: weight.rawValue >= NSFont.Weight.semibold.rawValue ? "PingFangSC-Semibold" : "PingFangSC-Regular", size: size) {
        return pingFang
    }
    return NSFont.systemFont(ofSize: size, weight: weight)
}

func drawText(
    _ text: String,
    in rect: NSRect,
    size: CGFloat,
    color: NSColor = ink,
    alignment: NSTextAlignment = .left,
    weight: NSFont.Weight = .semibold,
    lineHeight: CGFloat = 1.14
) {
    let paragraph = NSMutableParagraphStyle()
    paragraph.alignment = alignment
    paragraph.lineBreakMode = .byWordWrapping
    paragraph.minimumLineHeight = size * lineHeight
    paragraph.maximumLineHeight = size * lineHeight
    let attributes: [NSAttributedString.Key: Any] = [
        .font: font(size, weight: weight),
        .foregroundColor: color,
        .paragraphStyle: paragraph,
        .kern: -size * 0.025,
    ]
    NSString(string: text).draw(in: rect, withAttributes: attributes)
}

func fitSize(_ text: String, maxWidth: CGFloat, maxHeight: CGFloat, start: CGFloat, minimum: CGFloat, alignment: NSTextAlignment = .left) -> CGFloat {
    var size = start
    while size > minimum {
        let paragraph = NSMutableParagraphStyle()
        paragraph.alignment = alignment
        paragraph.lineBreakMode = .byWordWrapping
        paragraph.minimumLineHeight = size * 1.14
        paragraph.maximumLineHeight = size * 1.14
        let attributes: [NSAttributedString.Key: Any] = [
            .font: font(size),
            .paragraphStyle: paragraph,
            .kern: -size * 0.025,
        ]
        let bounds = NSString(string: text).boundingRect(
            with: NSSize(width: maxWidth, height: maxHeight),
            options: [.usesLineFragmentOrigin, .usesFontLeading],
            attributes: attributes
        )
        if bounds.width <= maxWidth && bounds.height <= maxHeight { return size }
        size -= 4
    }
    return minimum
}

func drawRoundedRect(_ rect: NSRect, radius: CGFloat, fill: NSColor, stroke: NSColor? = nil, lineWidth: CGFloat = 2) {
    let path = NSBezierPath(roundedRect: rect, xRadius: radius, yRadius: radius)
    fill.setFill()
    path.fill()
    if let stroke {
        stroke.setStroke()
        path.lineWidth = lineWidth
        path.stroke()
    }
}

func drawBrandChrome(cardNumber: Int) {
    drawRoundedRect(
        NSRect(x: 150, y: 118, width: 86, height: 86),
        radius: 18,
        fill: NSColor(calibratedRed: 19/255, green: 23/255, blue: 34/255, alpha: 0.95),
        stroke: NSColor.white.withAlphaComponent(0.08),
        lineWidth: 2
    )
    drawText("TR", in: NSRect(x: 160, y: 130, width: 66, height: 50), size: 38, color: ink, alignment: .center, weight: .bold, lineHeight: 1)
    let barY: CGFloat = 180
    for (index, color) in [NSColor.systemRed, NSColor.systemRed, NSColor.systemGreen, NSColor.systemGreen].enumerated() {
        color.setFill()
        NSBezierPath(rect: NSRect(x: 172 + CGFloat(index) * 14, y: barY, width: 9, height: 5 + CGFloat(index % 2) * 3)).fill()
    }
    drawText("TradeReplay", in: NSRect(x: 266, y: 127, width: 440, height: 62), size: 43, color: ink, alignment: .left, weight: .semibold, lineHeight: 1)
    drawText("交易中的刻意练习 · EP.01", in: NSRect(x: 150, y: 238, width: 700, height: 46), size: 28, color: body, alignment: .left, weight: .medium, lineHeight: 1)
    drawText(String(format: "%02d / %02d", cardNumber, cards.count), in: NSRect(x: 3300, y: 145, width: 390, height: 52), size: 27, color: body, alignment: .right, weight: .medium, lineHeight: 1)
    drawText("tradereplay.dev", in: NSRect(x: 150, y: 2030, width: 420, height: 46), size: 26, color: body.withAlphaComponent(0.72), alignment: .left, weight: .medium, lineHeight: 1)
}

func drawCardContent(_ card: Card) {
    switch card.layout {
    case .hero:
        let combined = card.lines.joined(separator: "\n")
        let size = fitSize(combined, maxWidth: 3040, maxHeight: 1180, start: 245, minimum: 130, alignment: .center)
        let top: CGFloat = card.lines.count >= 3 ? 590 : 720
        for (index, line) in card.lines.enumerated() {
            let color = card.accent.contains(index) ? primary : ink
            drawText(line, in: NSRect(x: 400, y: top + CGFloat(index) * size * 1.2, width: 3040, height: size * 1.25), size: size, color: color, alignment: .center, weight: .semibold, lineHeight: 1)
        }

    case .center:
        let joined = card.lines.joined(separator: "\n")
        let size = fitSize(joined, maxWidth: 2920, maxHeight: 1060, start: 220, minimum: 120, alignment: .center)
        let totalHeight = CGFloat(card.lines.count) * size * 1.22
        let top = 1040 - totalHeight / 2
        for (index, line) in card.lines.enumerated() {
            drawText(line, in: NSRect(x: 460, y: top + CGFloat(index) * size * 1.22, width: 2920, height: size * 1.3), size: size, color: card.accent.contains(index) ? primary : ink, alignment: .center, weight: .semibold, lineHeight: 1)
        }

    case .split:
        let leftRect = NSRect(x: 250, y: 640, width: 1510, height: 980)
        let rightRect = NSRect(x: 2080, y: 640, width: 1510, height: 980)
        primary.withAlphaComponent(0.72).setFill()
        NSBezierPath(rect: NSRect(x: 1900, y: 700, width: 5, height: 820)).fill()
        for (index, line) in card.lines.prefix(2).enumerated() {
            let rect = index == 0 ? leftRect : rightRect
            let size = fitSize(line, maxWidth: rect.width, maxHeight: rect.height, start: 175, minimum: 105, alignment: .center)
            drawText(line, in: rect, size: size, color: card.accent.contains(index) ? primary : ink, alignment: .center, weight: .semibold)
        }

    case .vertical:
        guard let vertical = card.lines.first else { return }
        let characters = Array(vertical)
        let vSize: CGFloat = 122
        let top = 650 - CGFloat(max(0, characters.count - 2)) * 20
        for (index, character) in characters.enumerated() {
            drawText(String(character), in: NSRect(x: 300, y: top + CGFloat(index) * 150, width: 180, height: 150), size: vSize, color: primary, alignment: .center, weight: .semibold, lineHeight: 1)
        }
        if card.lines.count > 1 {
            let main = card.lines[1]
            let size = fitSize(main, maxWidth: 2760, maxHeight: 1100, start: 245, minimum: 130, alignment: .left)
            drawText(main, in: NSRect(x: 780, y: 710, width: 2760, height: 1120), size: size, color: ink, alignment: .left, weight: .semibold)
        }

    case .grid:
        let positions = [
            NSRect(x: 320, y: 590, width: 1460, height: 520),
            NSRect(x: 2060, y: 590, width: 1460, height: 520),
            NSRect(x: 320, y: 1260, width: 1460, height: 520),
            NSRect(x: 2060, y: 1260, width: 1460, height: 520),
        ]
        for (index, line) in card.lines.prefix(4).enumerated() {
            let rect = positions[index]
            drawRoundedRect(rect, radius: 42, fill: NSColor(calibratedRed: 13/255, green: 21/255, blue: 34/255, alpha: 0.76), stroke: primary.withAlphaComponent(card.accent.contains(index) ? 0.45 : 0.14), lineWidth: 3)
            let size = fitSize(line, maxWidth: rect.width - 140, maxHeight: rect.height - 130, start: 128, minimum: 78, alignment: .center)
            drawText(line, in: rect.insetBy(dx: 70, dy: 62), size: size, color: card.accent.contains(index) ? ink : inkSoft, alignment: .center, weight: .semibold)
        }

    case .list:
        let startY: CGFloat = 580
        for (index, line) in card.lines.enumerated() {
            let size = fitSize(line, maxWidth: 3000, maxHeight: 360, start: index == 1 ? 142 : 175, minimum: 100, alignment: .left)
            primary.setFill()
            NSBezierPath(roundedRect: NSRect(x: 420, y: startY + CGFloat(index) * 420 + 70, width: 70, height: 8), xRadius: 4, yRadius: 4).fill()
            drawText(line, in: NSRect(x: 560, y: startY + CGFloat(index) * 420, width: 2940, height: 330), size: size, color: card.accent.contains(index) ? primary : ink, alignment: .left, weight: .semibold)
        }

    case .equation:
        let count = card.lines.count
        if count == 3 {
            let width: CGFloat = 930
            for (index, line) in card.lines.enumerated() {
                let x = 280 + CGFloat(index) * 1280
                let size = fitSize(line, maxWidth: width, maxHeight: 600, start: 155, minimum: 95, alignment: .center)
                drawText(line, in: NSRect(x: x, y: 840, width: width, height: 580), size: size, color: card.accent.contains(index) ? primary : ink, alignment: .center, weight: .semibold)
                if index < count - 1 {
                    drawText("≠", in: NSRect(x: x + 990, y: 930, width: 240, height: 240), size: 120, color: body, alignment: .center, weight: .medium, lineHeight: 1)
                }
            }
        } else {
            let left = card.lines[0]
            let right = card.lines.count > 1 ? card.lines[1] : ""
            let leftSize = fitSize(left, maxWidth: 1400, maxHeight: 650, start: 180, minimum: 105, alignment: .center)
            let rightSize = fitSize(right, maxWidth: 1400, maxHeight: 650, start: 180, minimum: 105, alignment: .center)
            drawText(left, in: NSRect(x: 280, y: 820, width: 1400, height: 650), size: leftSize, color: card.accent.contains(0) ? primary : ink, alignment: .center, weight: .semibold)
            drawText("≠", in: NSRect(x: 1730, y: 950, width: 380, height: 250), size: 140, color: body, alignment: .center, weight: .medium, lineHeight: 1)
            drawText(right, in: NSRect(x: 2160, y: 820, width: 1400, height: 650), size: rightSize, color: card.accent.contains(1) ? primary : ink, alignment: .center, weight: .semibold)
        }

    case .cascade:
        let positions = [
            NSRect(x: 260, y: 520, width: 1900, height: 520),
            NSRect(x: 1180, y: 1020, width: 2300, height: 520),
            NSRect(x: 560, y: 1510, width: 2500, height: 380),
        ]
        for (index, line) in card.lines.prefix(3).enumerated() {
            let rect = positions[index]
            let size = fitSize(line, maxWidth: rect.width, maxHeight: rect.height, start: index == 0 ? 185 : 150, minimum: 96, alignment: index == 1 ? .right : .left)
            drawText(line, in: rect, size: size, color: card.accent.contains(index) ? primary : ink, alignment: index == 1 ? .right : .left, weight: .semibold)
        }
    }
}

func render(_ card: Card) throws {
    guard let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: Int(canvasSize.width),
        pixelsHigh: Int(canvasSize.height),
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    ), let baseContext = NSGraphicsContext(bitmapImageRep: bitmap) else {
        fatalError("Unable to create bitmap for card \(card.number)")
    }

    NSGraphicsContext.saveGraphicsState()
    // Bitmap contexts start at the bottom-left. Match the top-left coordinates
    // used by the layouts before asking AppKit to draw flipped text.
    baseContext.cgContext.translateBy(x: 0, y: canvasSize.height)
    baseContext.cgContext.scaleBy(x: 1, y: -1)
    NSGraphicsContext.current = NSGraphicsContext(cgContext: baseContext.cgContext, flipped: true)

    canvas.setFill()
    NSBezierPath(rect: NSRect(origin: .zero, size: canvasSize)).fill()

    let sourceAspect = background.size.width / background.size.height
    let targetAspect = canvasSize.width / canvasSize.height
    var sourceRect = NSRect(origin: .zero, size: background.size)
    if sourceAspect < targetAspect {
        let height = background.size.width / targetAspect
        sourceRect.origin.y = (background.size.height - height) / 2
        sourceRect.size.height = height
    } else {
        let width = background.size.height * targetAspect
        sourceRect.origin.x = (background.size.width - width) / 2
        sourceRect.size.width = width
    }
    background.draw(in: NSRect(origin: .zero, size: canvasSize), from: sourceRect, operation: .sourceOver, fraction: 1, respectFlipped: true, hints: nil)

    let overlay = NSGradient(colors: [
        NSColor(calibratedRed: 5/255, green: 9/255, blue: 17/255, alpha: 0.72),
        NSColor(calibratedRed: 5/255, green: 9/255, blue: 17/255, alpha: 0.26),
    ])!
    overlay.draw(in: NSRect(origin: .zero, size: canvasSize), angle: 0)

    drawBrandChrome(cardNumber: card.number)
    drawCardContent(card)

    NSGraphicsContext.restoreGraphicsState()

    guard let jpeg = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.92]) else {
        fatalError("Unable to encode card \(card.number)")
    }
    let filename = String(format: "%02d-%@.jpg", card.number, card.slug)
    try jpeg.write(to: outputDir.appendingPathComponent(filename))
}

let requestedNumber = CommandLine.arguments.dropFirst().first.flatMap(Int.init)
let cardsToRender = requestedNumber.map { number in cards.filter { $0.number == number } } ?? cards

for card in cardsToRender {
    try render(card)
    print(String(format: "Rendered %02d/%02d %@", card.number, cards.count, card.slug))
}

var plan = """
# 第一集开场大字卡片使用顺序

画面规格：3840 × 2160，16:9。建议先把 iPhone 口播放入剪映，再按编号依次拖入卡片。

卡片切换统一使用 0.2–0.3 秒“叠化”或“淡入淡出”，不要再添加其他复杂动画。建议时长只是初始值，最终以口播提示词出现的位置为准。

| 编号 | 口播切入提示 | 建议时长 | 文件 |
| ---: | --- | ---: | --- |
"""

plan += "\n"

for card in cards {
    let filename = String(format: "%02d-%@.jpg", card.number, card.slug)
    plan += "| \(String(format: "%02d", card.number)) | \(card.cue) | \(String(format: "%.0f", card.seconds)) 秒 | `intro-cards/\(filename)` |\n"
}

plan += """

## 剪映中的最简操作

1. 新建 16:9 项目，先导入 iPhone 口播音频。
2. 将 `intro-cards` 中的图片按文件名顺序全部拖入时间线。
3. 听到表格中的“口播切入提示”时切换到对应卡片。
4. 卡片之间全部使用同一种“叠化”或“淡入淡出”，时长 0.2–0.3 秒。
5. 第 36 张结束后，直接切到 Screen Studio 录制的 TradeReplay 完整训练画面。
6. 不需要给每张卡片再次添加文字，也不要同时开启逐字字幕。
"""

try plan.write(to: episodeDir.appendingPathComponent("intro-card-timing.md"), atomically: true, encoding: .utf8)
print("Wrote timing plan")
