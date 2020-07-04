'use strict';
const { Contract } = require('fabric-contract-api');
const assert = require('assert')
const ClientIdentity = require('fabric-shim').ClientIdentity;
const QuanLyDiem  = require('../../../chaincode/javascript/lib/paper')
const { ChaincodeMockStub, Transform } = require("@theledger/fabric-mock-stub")
let chaincode = new QuanLyDiem()
const mockStub = new ChaincodeMockStub("MyMockStub", chaincode)
describe ('Test Mychaincode', () => {
	it("Should init without issues", async () => {
	   mockStub.mockTransactionStart()
//	   const initResult = await chaincode.khoiTao({stub:mockStub},[])
	   await chaincode.khoiTaoCacHocPhan({stub: mockStub}, 
        Buffer.from(JSON.stringify({
       "CT001" : {
                "ten" : "Lập trình căn bản",
                "sotinchi" : 2
       },
       "CT002" : {
                "ten" : "Lý thuyết đồ thị",
                "sotinchi" :  2
       },
       "CT003" : {
              "ten" : "Lập trình hướng đối tượng",
              "sotinchi" : 2
       },
       "CT004" : {
              "ten" : "Lập trình mạng",
              "sotinchi" : 2
       },
       "CT005" : {
              "ten" : "Điện toán đám mây",
              "sotinchi" : 2
       },
       "CT006" : {
              "ten" : "Lập trình Web",
              "sotinchi" : 3
       }
     }))
    )
     //khoi tao giang vien
     await chaincode.khoiTaoGiangVien({stub: mockStub}, 
        Buffer.from(JSON.stringify({
         "CT001" : {
            "magv" : "TVChau"
          },
         "CT002" : {
           "magv" : "PHCuong"
          },
        "CT003" : {
          "magv" : "TCDe"
          },
        "CT004" : {
          "magv" : "PTCang"
          },
        "CT005" : {
          "magv" : "NCHuy"
          },
        "CT006" : {
          "magv" : "NCHNgoc"
        }
        }))
    )
    await chaincode.themSinhVien({stub: mockStub}, 'B1609549', 'Phuong Thao', '362')
	});
 // Dang ky hoc phan
  it('should dangKiHocPhan initialized records', async()=>{
    console.log("Dang ky hoc phan")
    await chaincode.dangKyHocPhan({stub:mockStub},'B1609549','hocki1',
        JSON.stringify({'CT001':{diem: -1, magv: null},'CT002':{diem: -1, magv: null}}))

    await chaincode.dangKyHocPhan({stub:mockStub},'B1609549','hocki2',
        JSON.stringify({'CT003':{diem: -1, magv: null},'CT004':{diem: -1, magv: null}}))
   
    //await chaincode.dangKyHocPhan({stub:mockStub},'B1609549','hocki3',
     //   JSON.stringify({'CT005':{diem: -1, magv: null},'CT006':{diem: -1, magv: null}}))*/
  })  
  // Cho diem
  it('should choDiem initialized records', async()=>{
    await chaincode.choDiem({stub:mockStub},'B1609549','hocki1',JSON.stringify({'CT001':{diem: 'A', magv: 'TVChau', dinhdanh:'abc'},'CT002':{diem: 'A', magv: 'PHCuong', dinhdanh:'bcd'}}))
    await chaincode.choDiem({stub:mockStub},'B1609549','hocki2', JSON.stringify({'CT003':{diem: 'B+', magv: 'TCDe', dinhdanh: 'cdw'},'CT004':{diem: 'A', magv: 'PTCang', dinhdanh:'cfg'}}))
  })

  it('should truyVanGiangVien records', async()=>{
      console.log("Truy van giang vien")
      const truyVanGV = await chaincode.truyVanGV({stub:mockStub},'TVChau')

  })      

 //Truy van sinh vien
	it('should truyVan initialized records', async()=>{
      console.log("Truy van sinh vien")
      const truyVan = await chaincode.truyVan({stub:mockStub},'B1609549')
      console.log(
        JSON.stringify(JSON.parse(truyVan), null, 4)
      )
     // assert.equal(JSON.stringify(JSON.parse(truyVan).hocki.hocki1nam1), JSON.stringify({'QP003':{diem: -1, magv: null},'QP004':{diem: -1, magv: null}}))
  })  

  
	
 //  // it('should truyVan initialized records', async()=>{
 //  //   console.log("Truy van sinh vien")
 //  //   const truyVan = await chaincode.truyVan({stub:mockStub},'B1609549')
 //  //   console.log(
 //  //     JSON.stringify(JSON.parse(truyVan), null, 4)
 //  //   )
 //    // console.log()
 //    //assert.equal(JSON.stringify(JSON.parse(truyVan).hocki.hocki1nam1), JSON.stringify({'QP003':{diem: 'A', magv: 'GV001'},'QP004':{diem: 'A', magv: 'GV002'}}))
 //    // assert.equal(truyVan/ != "", true)
 //  // })  


  it('should tinhtichLuy initialized records', async()=>{
  	 await chaincode.tinhTichLuy({stub:mockStub},'B1609549')
  })

  it('should tinhDiemTBHocKy initialized records', async()=>{
    await chaincode.tinhTrungBinhHocKy({stub:mockStub},'B1609549','hocki1')
    //await chaincode.tinhTrungBinhHocKy({stub:mockStub},'B1609549','hocki2')
  })
  
  //  // xet tot nghiep
  it('should xetTotNghiep initialized records', async()=>{
    const xetTotNghiep = await chaincode.xetTotNghiep({stub:mockStub},'B1609549')
    console.log(xetTotNghiep)
  })
})
module.exports = QuanLyDiem;
