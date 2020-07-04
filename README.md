#Cấu hình nameserver trong thư mục /etc/resolv.conf thêm 8.8.8.8

sudo gedit /etc/resolv.conf 

nameserver 8.8.8.8

# Khởi động network lên trong thư mục /first-network

sudo ./byfn.sh up -n -a

# Khởi động docker exec-cli

./startChannel.sh

# Deploy chaincode trong cli

./scripts/deployChaincode.sh paper 1

# Chạy server trong thư mục /paper/javascripts

node server.js (do có các file node enrollAdmin.js, registerUser.js, khoiTaoTatCaHocPhan.js, khoiTaoGiangVien.js, themSinhVien.js, dangKyHocPhan.js, choDiem.js được chạy trong server rồi vì import dữ liệu vô file node)
Sử dụng node cho web là tinhTrungBinhHocKy.js (tinhTrungBinhHocKy.html), tinhTichLuy.js(tinhTichLuy.html), xetTotNghiep.js(xetTotNghiep.html), truyVan.js (trang index), truyVanBlock.js(truyVanBlock.html), truyVanTatCaBlock.js(truyVanTatCaBlock.html)

# Khi muốn down network phải tắt server xóa id trong wallet 

cd paper/ 

sudo ./networkDown.sh

cd first-network/

sudo ./byfn.sh down


