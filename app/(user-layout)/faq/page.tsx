import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const faqCategories = [
  {
    title: "Đặt hàng & Thanh toán",
    items: [
      {
        question: "Làm thế nào để đặt hàng?",
        answer:
          "Bạn có thể đặt hàng trực tiếp trên website bằng cách thêm sản phẩm vào giỏ hàng và tiến hành thanh toán. Hoặc liên hệ hotline 1900-1234 để được hỗ trợ đặt hàng.",
      },
      {
        question: "Có những phương thức thanh toán nào?",
        answer:
          "Chúng tôi hỗ trợ nhiều phương thức thanh toán: COD (thanh toán khi nhận hàng), chuyển khoản ngân hàng, ví điện tử MoMo, và thanh toán qua thẻ tín dụng/ghi nợ.",
      },
      {
        question: "Tôi có thể hủy đơn hàng không?",
        answer:
          "Bạn có thể hủy đơn hàng miễn phí khi đơn hàng chưa được xác nhận hoặc đóng gói. Vui lòng liên hệ ngay với chúng tôi qua hotline để được hỗ trợ.",
      },
    ],
  },
  {
    title: "Vận chuyển & Giao hàng",
    items: [
      {
        question: "Phí vận chuyển là bao nhiêu?",
        answer:
          "Phí vận chuyển là 30.000đ cho đơn hàng dưới 200.000đ. Miễn phí vận chuyển cho đơn hàng từ 200.000đ trở lên trong nội thành TP.HCM và Hà Nội.",
      },
      {
        question: "Thời gian giao hàng bao lâu?",
        answer:
          "Nội thành TP.HCM và Hà Nội: 1-2 ngày làm việc. Các tỉnh thành khác: 3-5 ngày làm việc. Thời gian có thể thay đổi tùy thuộc vào địa chỉ và tình hình vận chuyển.",
      },
      {
        question: "Làm sao để theo dõi đơn hàng?",
        answer:
          "Sau khi đơn hàng được xác nhận, bạn sẽ nhận được mã vận đơn qua email và SMS. Bạn có thể theo dõi đơn hàng trong mục 'Đơn hàng của tôi' trên website.",
      },
    ],
  },
  {
    title: "Sản phẩm & Chất lượng",
    items: [
      {
        question: "Sản phẩm có được đảm bảo chất lượng không?",
        answer:
          "Tất cả sản phẩm đều được nhập khẩu từ các nguồn uy tín, có đầy đủ giấy tờ kiểm định chất lượng và an toàn thực phẩm. Chúng tôi cam kết 100% chính hãng.",
      },
      {
        question: "Nếu sản phẩm bị lỗi thì xử lý như thế nào?",
        answer:
          "Nếu sản phẩm bị lỗi do nhà sản xuất hoặc vận chuyển, chúng tôi sẽ đổi trả miễn phí trong vòng 7 ngày. Vui lòng giữ nguyên bao bì và liên hệ hotline để được hỗ trợ.",
      },
      {
        question: "Làm sao biết hạn sử dụng của sản phẩm?",
        answer:
          "Hạn sử dụng được in rõ trên bao bì sản phẩm. Chúng tôi cam kết chỉ giao hàng với hạn sử dụng còn ít nhất 2/3 thời gian.",
      },
    ],
  },
  {
    title: "Đổi trả & Hoàn tiền",
    items: [
      {
        question: "Chính sách đổi trả như thế nào?",
        answer:
          "Chấp nhận đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi, hỏng hóc hoặc không đúng mô tả. Sản phẩm phải còn nguyên seal, chưa qua sử dụng.",
      },
      {
        question: "Khi nào tôi nhận được tiền hoàn?",
        answer:
          "Sau khi xác nhận đổi trả thành công, tiền sẽ được hoàn lại trong vòng 5-7 ngày làm việc tùy theo phương thức thanh toán ban đầu.",
      },
      {
        question: "Chi phí đổi trả do ai chịu?",
        answer:
          "Nếu lỗi do shop, chúng tôi sẽ chịu toàn bộ chi phí vận chuyển đổi trả. Nếu khách hàng đổi ý, khách hàng vui lòng thanh toán phí vận chuyển.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Câu hỏi thường gặp</h1>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Tìm câu trả lời cho những thắc mắc phổ biến của bạn
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {faqCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                        <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto mt-12">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Không tìm thấy câu trả lời?</h3>
              <p className="text-muted-foreground mb-4">Liên hệ với chúng tôi để được hỗ trợ trực tiếp</p>
              <Button asChild size="lg">
                <Link href="/contact">Liên hệ hỗ trợ</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
