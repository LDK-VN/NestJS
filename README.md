# NestJS

NestJS
1. NestJS là gì?
    1.  Là framework để xấy dựng các ứng dụng server-side bằng nodeJS.
    2. Sử dụng Typescript
    3. OOP, FR(Functional Programming), FRP(Functional Reactive Programming).
    4. Sử dụng HTTP servers framework
        * Express (default)
        * Fastify

2. Nó làm được gì?
    * Kiến trúc out-of-the-box -> Mở rộng, dễ maintain, … -> Lấy từ Angular

3. NestJS có gì?
    * Design pattern -> Dependency Injection
    * Cú pháp giống Angular
    * Nhiều module support như hot reload, logger, GraphQL, Websocket, cqrs pattern, microservices,…

4. FP là gì?
    * Mô hình
    * Dựa trên function
    * Tránh thay đổi giá trị của dữ liệu

* Lợi ích:
    * Block xử lý độc lập -> tái sử dụng
    * Thuận lợi -> thay đổi logic, tìm lỗi

* Ưu điểm:
    * Kết hợp function -> tối đa khả năng tái sử dụng
    * Chỉ có function
    * Điều khiển luồng bằng connect các functions
    * Chú trọng thực thi luồng chương trình -> connect high order function

* Tại sao nên dùng?
    * Khai báo 1 lần -> không dk thay đổi
    * Biến or object -> immutable (bất biến)
    * Pure function -> không thay đổi ngoài phạm vi
    * Dễ kiểm tra
    * Code dễ đọc

* Nhược điểm
    * Kết hợp function vào 1 program khó -> tuân theo pattern giống nhau -> nếu ko dễ xảy ra lỗi
    * Đi kèm với toán học nâng cao
    * Nắm vững đệ quy.
5. Dependency injection 
    1. Dependency
        * Class A -> sử dụng chức năng của class B
          2. Có 3 loại:
        * Contructor injection: các depency đk cung cấp thông qua constructor của class.
        * Setter injection: client tạo ra một setter method để class khác có thể sử dụng chúng để cấp dependency
        * Interface injection: dependency cung cập một hàm injector để inject nó vào bất kì client nào dk truyền vào. Các client phải implement một interface mà có một setter method dành cho việc nhận dependency.
* Ích
    * Viết Unit test dễ dàng
    * Giảm boilerplate code vì việc khởi tạo dependency dk làm bởi một component khác
    * Mở rộng dự án dễ dàng
    * loose coupligng giữa các thành phần trong dự án
* Nhược
    * Phức tạp để học, dùng quá sẽ có vấn đề
    * Nhiều lỗi ở compile time -> đẩy sang runtime.
    * Ảnh hưởng tới chức năng auto-complete hay find references của một số IDE
