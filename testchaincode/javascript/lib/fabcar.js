
'use strict';

const { Contract } = require('fabric-contract-api');
const assert = require('assert')
class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const papers = [          
            {
                mssv: 'B1609548',
                name: 'Truong Thi Phuong Thao',
                year: '2021',
                type: 'Kha',
            },
        ];

        for (let i = 0; i < papers.length; i++) {
            await ctx.stub.putState(papers[i].mssv, Buffer.from(JSON.stringify(papers[i])));
            console.info('Added <--> ', papers[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryPaper(ctx, mssv){
    	const paperAsBytes = await ctx.stub.getState(mssv);
    	return paperAsBytes.toString();
    }

    async submitPaper(ctx, mssv, name, year, type){
    	console.info('============= START : Submit Paper ===========');
    	const paper = {
    		mssv,
    		name,
    		year, 
    		type,
    	};
    	await ctx.stub.putState(mssv,Buffer.from(JSON.stringify(paper)));
    	const submitPaper = await ctx.stub.getState(mssv);
    	console.log(submitPaper.toString());
    	console.info('============= END : Submit Paper ===========');
    }
    async replyPaper(ctx, mssv, accept){  
    	const paperContent = JSON.parse(await ctx.stub.getState(mssv))
    	if (accept){
    		paperContent.approved = true

    	} else {
    		paperContent.approved = false
    	}

    	if(!accept){
    		await ctx.stub.deleteState(mssv,Buffer.from(JSON.stringify(paperContent))) 	
    	} else {
    		await ctx.stub.putState(mssv,Buffer.from(JSON.stringify(paperContent)));
    	}
    		
    }
}
const { ChaincodeMockStub, Transform } = require("@theledger/fabric-mock-stub")
let chaincode = new FabCar()
const mockStub = new ChaincodeMockStub("MyMockStub", chaincode)

describe ('Test Mychaincode', () => {
    it("Should init without issues", async () => {
       
       mockStub.mockTransactionStart()
       const initResult = await chaincode.initLedger({stub:mockStub},[])
       
       //const submitResult = await chaincode.submitPaper({stub:mockStub},['B1609550'],'Lisa','2021','gioi')
       //const replyResult = await chaincode.replyPaper({stub:mockStub},['B1609548'])
    });

    it('should query initialized records', async()=>{
    	const paperResult = await chaincode.queryPaper({stub:mockStub},'B1609548')
        console.log(paperResult)
        assert.equal(paperResult != "", true)
    })
    it('should unapprove the current paper', async()=>{
        await chaincode.submitPaper({stub:mockStub},'B1609550', 'Bang dai hoc', '2020', 'Paper')
    	await chaincode.replyPaper({stub:mockStub},'B1609550', false) 
        const paperResult = await chaincode.queryPaper({stub:mockStub},'B1609550') 
        console.log(paperResult)
        assert.equal(paperResult == "", true) 

    })	
   it('should appprove and see changes', async()=>{
    	await chaincode.submitPaper({stub:mockStub},'B1609550', 'Bang dai hoc', '2020', 'Paper')
    	await chaincode.replyPaper({stub:mockStub},'B1609550', true) 
        const paperResult =JSON.parse(await chaincode.queryPaper({stub:mockStub},'B1609550'))
        console.log(paperResult)

        assert.equal(paperResult.approved, true)
    })
});
module.exports = FabCar;
