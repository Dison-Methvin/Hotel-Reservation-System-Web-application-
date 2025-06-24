const mongoose = require('mongoose');
const Staff = require('../src/models/staff.model');
require('dotenv').config();

(async ()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost:27017/hotel_reservation_system');
    const staffData=[
      {username:'admin',password:'admin123',firstName:'Alice',lastName:'Admin',role:'admin',email:'admin@celestia.com',phone:'0770000000',employeeId:'EMP001'},
      {username:'manager',password:'manager123',firstName:'Michael',lastName:'Manager',role:'manager',email:'manager@celestia.com',phone:'0771111111',employeeId:'EMP002'},
      {username:'clerk',password:'clerk123',firstName:'Cathy',lastName:'Clerk',role:'clerk',email:'clerk@celestia.com',phone:'0772222222',employeeId:'EMP003'},
      {username:'travel',password:'travel123',firstName:'Tom',lastName:'Travel',role:'travel',email:'travel@celestia.com',phone:'0773333333',employeeId:'EMP004'}
    ];
    await Staff.deleteMany({ username: {$in: staffData.map(s=>s.username)} });
    await Staff.insertMany(staffData);
    console.log('Seeded staff accounts');
    process.exit(0);
  }catch(err){
    console.error(err);process.exit(1);
  }
})(); 