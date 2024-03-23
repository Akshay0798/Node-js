const fs = require('fs'); //fs use to intract with file system

//Sync
// fs.writeFileSync('./File_Handling/test.txt',"my anme is shay");

//Async
// fs.writeFile('./File_Handling/test1.txt','its a async functon',(err)=>{});

// const result = fs.readFileSync('./File_Handling/contact.txt','utf-8');
// console.log(result);

// fs.readFile('./File_Handling/contact.txt','utf-8',(err,result) => {
//     if(err){
//         console.log("Error",err)
//     }else{
//         console.log("Result",result)
//     }
// })

var date = new Date();
var formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

fs.appendFileSync("./File_Handling/test.txt",`${formattedTime} -> Hey There\n`)
