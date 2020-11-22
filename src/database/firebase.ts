import admin, {firestore} from 'firebase-admin'
import { serviceAccountCredentials } from '../serviceAccountKey'
const serviceAccount = serviceAccountCredentials as admin.ServiceAccount

//Membuat struktru data yang akan dimasukkan kedalam body Rest API
export type Antrian ={
    antrian : number
    nama : string
    kota : string
    provinsi : string
    umur : number
    keperluan : string
}

admin.initializeApp({
    credential : admin.credential.cert(serviceAccount),
    databaseURL: 'https://simplebank-a568a.firebaseio.com'
})

const db = admin.firestore();
const antrianRef=db.collection('antrian')

export class FirebaseClient {
    private db : firestore.Firestore
    private antrianRef : firestore.CollectionReference<firestore.DocumentData>

    constructor() {
        this.db = db;
        this.antrianRef= antrianRef
    }

    //Fungsi untuk melakukan pembuatan data antrian
    async addData(antri : Antrian){
        const ant= antri as firestore.DocumentData
        try {
            await antrianRef.add(ant)
        } catch (error) {
            throw error
        }
        return
    }

    //Fungsi untuk mendapatkan semua data antrian
    async getData(){
        let snapshot
        try {
            snapshot = await this.antrianRef.get()
        } catch (error) {
            throw error
        }
        return snapshot.docs.map(doc=>doc.data())
    }

    //Fungsi untuk mendapatkan data antrian berdasarkan nomor urut antrian
    async getDataByAntrian(antrian:number){
        let snapshot
        try{
            snapshot=await antrianRef.where('antrian','==',antrian).get()
        } catch(error){
            throw error
        }
        return snapshot.docs.map(doc => doc.data())
    }

    //Fungsi untuk melakukan update terhadap data antrian
    async updateData(id: string, update: Object) {
        let snapshot
        try {
          snapshot=await antrianRef.doc(id).update({
            ...update
          })
          snapshot=await antrianRef.doc(id).get()
        } catch (error) {
          throw error
        }
        return snapshot.data()
    }

    //Fungsi untuk melakukan penghapusan semua data antrian
    async deleteData() {
        let snapshot
        let ant = admin.firestore().batch()
        try {
          snapshot = await this.antrianRef.get()
          snapshot.docs.forEach((doc) => {
            ant.delete(doc.ref)
          })
        } catch (error) {
          throw error
        }
        return ant.commit()
    }

    //Fungsi untuk melakukan penghapusan data antrian berdasarkan id data
    async deleteDataById(id:string) {
        try {
          await antrianRef.doc(id).delete()
        } catch (error) {
          throw error
        }
        return
    }
    
}
