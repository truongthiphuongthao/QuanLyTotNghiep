'use strict';
const { Contract } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;
class QuanLyDiem extends Contract {
	async getIdentity(ctx) { 
		let cid = new ClientIdentity(ctx.stub)
		let id = cid.getAttributeValue('name')
		return id
	}

	async khoiTao(ctx){
		const obj_sv = 
		{
			"B1609548":{
				"ten": "Le Van A",
				"cmnd": "001",
				"hocphan":{
				    "CT173-01":{
				    	"diem": 7,
				    	"tinchi":3,
				    	"choboi": "GV-001-TMThai"
				    },
				    "CT174-01":{
				    	"diem": 4,
				    	"tinchi":3,
				    	"choboi": "GV-002-VTThuc"
				    },
				    "ML002-02":{
				    	"diem": 10,
				    	"tinchi":3,
                                        "choboi": "GV-003-PVBua"
				    },
				    "KL001-01":{
				    	"diem": 8,
				    	"tinchi":3,
				    	"choboi": "GV-003-DTNguyen"
				    }
				 }
			},
		    "AllowedUser":[
				{"tengv": "GV-002-PTCang"},
				{"tengv": "GV-003-NTNghe"}
			]		
		}
		await ctx.stub.putState("B1609548",Buffer.from(JSON.stringify(obj_sv["B1609548"])))
		await ctx.stub.putState("AllowedUser",Buffer.from(JSON.stringify(obj_sv["AllowedUser"])))
		console.info(obj_sv["B1609548"])
		console.info(obj_sv["AllowedUser"])
	}
	// Khoi tao hoc phan
	async khoiTaoCacHocPhan(ctx, hocphan) {
		// TODO: Privilege
		ctx.stub.putState("__hocphan__", hocphan)
	}

	// khoi tao giang vien
	async khoiTaoGiangVien(ctx, giangvien){
		ctx.stub.putState("__giangvien__", giangvien)		
	}
	//truy van giang vien
	async truyVanGV(ctx, magv){ // truy van cac hoc phan ma giang vien day:
		const gv = JSON.parse(await ctx.stub.getState('__giangvien__'))
		const hocphan = JSON.parse(await ctx.stub.getState('__hocphan__'))
		let cacHocPhan  = []
		for(let key in gv) { // TODO: fix this bad practice
			if (gv[key].magv == magv) 
				cacHocPhan.push(key)
		}
		let tenhocphan = []
		for(let hp in hocphan){
			if(hp == cacHocPhan){
				tenhocphan.push(hocphan[hp].ten)
			}
		}
		console.log(
				{
					"mahocphan": cacHocPhan,
					"tenhocphan": tenhocphan
				}
			)
		//console.log(hocphan)
		return JSON.stringify(
				{
					"mahocphan": cacHocPhan,
					"tenhocphan": tenhocphan
				}
			)
	}
	// Nha truong them sinh vien
	async themSinhVien(ctx, mssv, ten, cmnd) {
		let tatCaHocPhan = await ctx.stub.getState('__hocphan__')
		// TODO: add middleware
		const sinhvien = {
			'ten': ten,
			'cmnd': cmnd,
			'hocki' : {
				'hocki1' : {
					
				},
				'hocki2' : {

				},
				'hocki3' : {

				}
			} 
				
		}
		await ctx.stub.putState(mssv, Buffer.from(JSON.stringify(sinhvien)));
		console.log("them sinh vien thanh cong")
	}
	// Nha truong cho sinh vien dang ky hoc phan
	async dangKyHocPhan(ctx, mssv, hocki, hocphan) {
		const sv = await ctx.stub.getState(mssv);
		const svinfo = JSON.parse(sv);
		console.log(svinfo.hocki[hocki])
		// todo: Kiem tra hocphan xem hop le k
		if (svinfo.hocki[hocki] != undefined){
			svinfo.hocki[hocki] = JSON.parse(hocphan)
			await ctx.stub.putState(mssv, Buffer.from(JSON.stringify(svinfo)));
		}
		else throw 'khong the dang ky duoc nua'
	}
    // Giang vien cho diem tung sinh vien
	async choDiem(ctx, mssv, ki, maLopHocPhan){
		const sv = await ctx.stub.getState(mssv);
	    const svinfo = JSON.parse(sv); 
	    const gv = await ctx.stub.getState('__giangvien__')
	    const gvinfo = JSON.parse(gv)
	    if(svinfo.hocki[ki] != undefined){
	    	svinfo.hocki[ki] = JSON.parse(maLopHocPhan)
	    }
	    await ctx.stub.putState(mssv, Buffer.from(JSON.stringify(svinfo)));
	}
	// Hien thi len van bang sinh vien
    async truyVan(ctx, mssv){ // truy van cac diem cua sinh vien
		const sv = await ctx.stub.getState(mssv)
		console.log("Sinh vien:"+sv)
		return sv
	}
	// Nha truong tinh trung binh tung hoc ki cho sinh vien
	async tinhTrungBinhHocKy(ctx, mssv, hocki){// tinh diem trung binh hoc ki
		// lay ra sinh vien
		const sv = await ctx.stub.getState(mssv) 
		const svinfo = JSON.parse(sv) 
		// lay ra hoc phan
		const hp = await ctx.stub.getState('__hocphan__')
		const hpinfo = JSON.parse(hp)
		let sinhvien = svinfo
		let tthp = hpinfo
		let tong = 0;
		let tongSoChiTB = 0;
		let diemHocKy = sinhvien.hocki[hocki]
		for(let hocphan in diemHocKy){
			const bangDiem = {
				'A': 4, 
				'B+': 3.5,
				'B': 3.0,
				'C+': 2.5 ,
				'C': 2.0,
				'D+': 1.5,
				'D': 1.0,
				'F': 0.0
			}		
			let diem = diemHocKy[hocphan].diem
			tong += bangDiem[diem] * tthp[hocphan].sotinchi
			tongSoChiTB += tthp[hocphan].sotinchi
		}
		let diemTB = tong/tongSoChiTB
		return JSON.stringify({
		   'diem' : diemTB.toFixed(2),
	       'sochi' : tongSoChiTB
		})
	}
	// Nha truong tinh tich luy cho tung sinh vien
	async tinhTichLuy(ctx, mssv){// tinh diem tich luy hien tai
		// lay ra sinh vien
		const sv = await ctx.stub.getState(mssv) 
		const svinfo = JSON.parse(sv) 
		// lay ra hoc phan
		const hp = await ctx.stub.getState('__hocphan__')
		const hpinfo = JSON.parse(hp)
		let sinhvien = svinfo
		console.log(JSON.stringify(sinhvien))
		let tthp = hpinfo
		let tong = 0;
		let tongSoChiTL = 0;
		for(let hocki in sinhvien.hocki){
			let diemHocKy = sinhvien.hocki[hocki]
			for(let hocphan in diemHocKy){
				const bangDiem = {
					'A': 4, 
					'B+': 3.5,
					'B': 3.0,
					'C+': 2.5 ,
					'C': 2.0,
					'D+': 1.5,
					'D': 1.0,
					'F': 0.0
				}		
				let diem = diemHocKy[hocphan].diem
				if(diem != 'F'){
					tong += bangDiem[diem] * tthp[hocphan].sotinchi
					tongSoChiTL += tthp[hocphan].sotinchi
				}
			}
		}
		let diemTBTL = tong/tongSoChiTL
		return JSON.stringify(
			{
			   'diem' : diemTBTL.toFixed(2),
		       'sochi' : tongSoChiTL
			}
		)

	}
    // Nha truong xet tot nghiep cho sinh vien
	async xetTotNghiep(ctx, mssv){ // xet xem sinh vien co tot nghiep khong 
		const sv = await ctx.stub.getState(mssv) 
		const svinfo = JSON.parse(sv)
		let sinhvien = svinfo 
		let tong = 0;
		let tichLuy = JSON.parse(await this.tinhTichLuy(ctx, mssv))
		let tongSoChi = tichLuy.sochi
		let diemTotNghiep = tichLuy.diem
		let loai
		let kq = tongSoChi>=24 ? "Đã tốt nghiệp" : "Chưa tốt nghiệp"
		if(tongSoChi>=24){
			if(diemTotNghiep >= 3.6)
			{
				loai = "Xuất sắc"
			}
			else if(diemTotNghiep>=3.2 && diemTotNghiep<3.6)
			{
				loai = "Giỏi"
			}
			else if(diemTotNghiep>=2.5 && diemTotNghiep<3.2)
			{
				loai = "Khá"
			}
			else if(diemTotNghiep>=2.0 && diemTotNghiep<2.5)
			{
				loai = "Trung bình"
			}
		}
		else 
		{
			loai = "Chưa hoàn thành chương trình học"
		}
		return JSON.stringify(
			{ 
				'diemTotNghiep' : diemTotNghiep,
		        'tongSoChi' : tongSoChi,
		       	'kq' : kq ,
		       	'loai': loai
			} 
		)
	}
}	    
module.exports = QuanLyDiem;
