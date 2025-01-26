const dbConn=require("../db/mysql_connect")
const bcrypt=require("bcrypt")
const APIError=require("../middleware/errorHandler")
const Response=require("../utils/response")
const musteri_ekle = async (req, res) => {
    try {
        const { kullanici_adi, sifre, eposta, adi, soyadi, tel_no, cinsiyet, dogum_tarihi, yas } = req.body;

        // Hashing password
        const hashedPassword = await bcrypt.hash(sifre, 10);

        // Check if email already exists
        const [rows] = await dbConn.query("SELECT * FROM kullanicilar WHERE eposta=?", [eposta]);

        if (rows.length > 0) {
            return res.status(409).json({
                success: false,
                data: req.body,
                message: "Kayıt Mevcut"
            });
        } else {
            // Insert user data into the database
            const [insertResult] = await dbConn.query(
                "INSERT INTO kullanicilar (kullanici_adi, sifre, eposta, adi, soyadi, tel_no, cinsiyet, dogum_tarihi, yas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [kullanici_adi, hashedPassword, eposta, adi, soyadi, tel_no, cinsiyet, dogum_tarihi, yas]
            );
            
            return res.json({
                success: true,
                data: req.body,
                message: "Kayıt Başarıyla Oluşturuldu"
            });
        }
    } catch (error) {
        console.error("Database Error", error);
        return res.status(500).json({
            success: false,
            data: null,
            message: "Bir hata oluştu"
        });
    }
}
const musteri_getir=async(req,res)=>{
    try{
        const [result]=await dbConn.query("SELECT * FROM kullanicilar")
        res.json(result)
    }catch(error){
        console.error("Database error",error)
        res.status(500).json({
            message:"Kullanıcılar gelmedi"
        })
    }
}

const satis_getir=async(req,res)=>{
try{
const [result]=await dbConn.query("SELECT sales_date,sales_amount FROM sales_data")
res.json({
    success:true,
    data:result
})
}catch(error){
console.error("Database Error",error)
res.status(500).json({
    success:false,
    message:"Veri Alınamadı"
})
}
}
const siparis_getir=async(req,res)=>{
    try{
        const [results]=await dbConn.query("SELECT * from siparisler");
        return res.status(200).json({
            success:true,
            data:results
        })
    }catch(error){
        console.error("veritabanı hatası",error)
        return res.status(500).json({
            success:false,
            message:"Siparişler Alınamadı"
        })
    }
}
const siparis_getir_by_tarih=async(req,res)=>{
const {startDate,endDate}=req.query
if(!startDate||!endDate){
    return res.status(400).json({
        success:false,
        message:"Başlangıç ve Bitiş tarihleri eksik"
    })
}
try{
    const [results]=await dbConn.query("SELECT * FROM siparisler Where siparis_tarihi BETWEEN ? AND ?",[startDate,endDate])
    return res.status(200).json({
        success:true,
        data:results
    })
}catch(error){
    return res.status(500).json({
        success:false,
        message:"Veriler Alınamadı"
    })
}
}
module.exports={kullanici_ekle,kullanici_getir,satis_getir,siparis_getir,siparis_getir_by_tarih}