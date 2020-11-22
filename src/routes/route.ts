import {Router} from 'express'
import {FirebaseClient} from '../database/firebase'
const firebaseClient = new FirebaseClient()

const router = Router()

//Route untuk membuat data antrian
router.post('/antrian',async (req,res,next)=>{
    const antri =req.body
    try {
        await firebaseClient.addData(antri)
    } catch (error) {
        throw error
    }

    //Respon yang akan ditampilkan setelah data berhasil dibuat
    res.json({
        Urutan : antri.antrian,
        Nama : antri.nama,
        Keperluan : antri.keperluan,
        Status : "Berhasil Ditambahkan"
    })
})

//Route untuk mendapatkan semua data antrian
router.get('/antrian',async (req,res,next)=>{
    let antrian
    try{
        antrian=await firebaseClient.getData()
    } catch(error){
        return next(error)
    }
    res.json(antrian)
})

//Route untuk mendapatkan data berdasarkan nomor urut antrian
router.get('/antrian/:antrian',async (req,res,next)=>{
    const antrian=Number(req.params.antrian)
    let antrians
    try{
        antrians =await firebaseClient.getDataByAntrian(antrian)
    } catch(error){
        return next(error)
    }
    res.json(antrians)
})

//Route untuk memperbarui data antrian berdasarkan id data
router.put('/antrian/:id', async (req, res, next) => {
    const id=req.params.id
    const update=req.body
    let antrian
    try {
        antrian = await firebaseClient.updateData(id,update)
    } catch (error) {
        return next(error)
    }
    res.json(antrian)
});

//Route untuk menghapus semua data antrian
router.delete('/antrian', async (req, res, next) => {
    let cussers
    try {
       cussers = await firebaseClient.deleteData()
    } catch (error) {
       return next(error)
    }
    res.json({ message: 'Data telah dihapus'})
})


//Route untuk menghapus data antrian berdasarkan id
router.delete('/antrian/:id', async (req, res, next) => {
    const id=req.params.id
    let antrian
    try {
        await firebaseClient.deleteDataById(id)
    } catch (error) {
        return next(error)
    }
    res.json({
        message:"Data Deleted"
    })
});

export default router