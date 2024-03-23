import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'




const app = express();
app.use(cors(
    {
        origin: ["http://localhost:3000"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
})



con.connect(function (err) {
    if (err) {
        console.log("Error in connection ");

    } else {
        console.log("Connected");

    }
})


app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql " });
        return res.json({ Status: "Success", Result: result })
    })


    
})


app.get('/get/:id', (req, res) => {

    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    con.query(sql, [id], (err, result) => {

        if (err) return res.json({ Error: "Get employee error in sql " });
        return res.json({ Status: "Success", Result: result })

    })
})

////////////////////////////////////////////////////////////////////////////////
//////update all (name,email,address,salary)
app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee SET name = ?, email = ? , age = ?, address = ?, occupation = ? WHERE id = ?";
    const { name, email,age, address, occupation } = req.body;

    con.query(sql, [name, email,age, address, occupation, id], (err, result) => {
        if (err) {
            return res.json({ Error: "Update employee error in SQL" });
        }
        return res.json({ Status: "Success" });
    });
});



////for delete
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Delete employee error in sql " });
        return res.json({ Status: "Success" })


    })

})





/////api for admin count
app.get('/adminCount', (req, res) => {
    const sql = "Select count(id) as admin from users";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})
app.get('/employeeCount', (req, res) => {
    const sql = "Select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})





// Combined register endpoint
app.post('/register', (req, res) => {
    const { name, email, age, occupation, address, password, role } = req.body;

    let tableName, roleType;

    // Determine the table and role based on the role parameter
    if (role === 'user') {
        tableName = 'users';
        roleType = 'user';
    } else if (role === 'employee') {
        tableName = 'employee';
        roleType = 'employee';
    } else {
        return res.json({ Status: "Error", Error: "Invalid role specified" });
    }

    const sql = `INSERT INTO ${tableName} (name, email, age, occupation, address, password,role) VALUES (?, ?, ?, ?, ?, ?,?)`;
    const values = [name, email, age, occupation, address, password,role];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error(`Error registering ${roleType}:`, err);
            return res.json({ Status: "Error", Error: `Failed to register ${roleType}` });
        }

        // User or employee successfully registered
        console.log(`${roleType} registered successfully`);
        return res.json({ Status: "Success", Message: `${roleType} registered successfully` });
    });
});


app.listen(8000, () => {
    console.log("Running")
})

