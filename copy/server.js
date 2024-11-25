console.log(__dirname+ '/public');
const express = require('express');
const path = require('path');
const app = express();
const fs=require('fs');

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

app.use(express.json());

app.get('/', function(req, res){
    fs.readdir(`./files`,function(err,files){
    res.render('server',{files:files});
    console.log(files);
    })
});
app.post('/create', function(req, res) {
    // Generate the filename by removing spaces and adding ".txt"
    const filename = req.body.title.split(' ').join('') + '.txt';
    const filePath = `./files/${filename}`;

    // Write the task details into the file
    fs.writeFile(filePath, req.body.details, function(err) {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Error creating the task.');
        }
        // Redirect back to the home page after successful creation
        res.redirect('/');
    });
});

app.get('/files/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
       

       
        res.render('show',{filename:req.params.filename,filedata:filedata});
            
    });
});
app.get('/edit/:filename', function (req, res) {
        res.render('edit',{filename:req.params.filename});
            
   
});
app.post('/edit', function (req, res) {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function (err) {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.status(500).send('Error renaming the file.'); // Send an error response
        }
        res.redirect('/'); // Redirect on success
    });
});



app.listen(3000,function(){
    console.log("server is running on port 3000");
})