const fs = require("fs");


fs.readFile("tasks.json","utf8",(error, data) => {
     if(error){
		console.error(error)
		return
	}

        const tasks = JSON.parse(data)

        tasks.push({
    id: 1,
    title: "Learn Node",
    completed: false
  });

     fs.writeFile("tasks.json",JSON.stringify(tasks), (error) => {
	if(error){
	  console.error(error)
	  return
	}
      console.log("Tasks saved")

   })


});
