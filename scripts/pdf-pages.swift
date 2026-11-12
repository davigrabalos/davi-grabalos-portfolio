import Foundation
import PDFKit
import AppKit
let args = CommandLine.arguments
let doc = PDFDocument(url: URL(fileURLWithPath: args[1]))!
let out = args[2]
let maxSide = CGFloat(Double(args[3])!)
print("pages", doc.pageCount)
for i in 0..<doc.pageCount {
  let page = doc.page(at: i)!
  let box = page.bounds(for: .mediaBox)
  let scale = maxSide / max(box.width, box.height)
  let size = NSSize(width: box.width * scale, height: box.height * scale)
  let img = page.thumbnail(of: size, for: .mediaBox)
  let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
  let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.82])!
  try! data.write(to: URL(fileURLWithPath: String(format: "%@/%02d.jpg", out, i + 1)))
  print(i + 1, Int(box.width), Int(box.height))
}
