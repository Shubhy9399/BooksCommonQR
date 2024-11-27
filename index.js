const express = require("express");
const bodyParser = require("body-parser");
const QRCode = require("qrcode");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 4000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); // To handle form data
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files (e.g., CSS)

currentLocation = "Raipur";

// Database to store book details
const books = [
  {
    id: 1,
    title: "The Cat in the Hat",
    publisher: "Chhattisgarh Publisher",
    district: "Durg",
  },
  {
    id: 2,
    title: "Where the Wild Things Are",
    publisher: "Chhattisgarh Publisher",
    district: "Raipur",
  },
  {
    id: 3,
    title: "Charlotte's Web",
    publisher: "Chhattisgarh Publisher",
    district: "Raipur",
  },
  {
    id: 4,
    title: "Goodnight Moon",
    publisher: "Chhattisgarh Publisher",
    district: "Bilaspur",
  },
  {
    id: 5,
    title: "The Very Hungry Caterpillar......",
    publisher: "Chhattisgarh Publisher",
    district: "Korba",
  },
  {
    id: 6,
    title: "Green Eggs and Ham",
    publisher: "Chhattisgarh Publisher",
    district: "Jagdalpur",
  },
  {
    id: 7,
    title: "Matilda",
    publisher: "Chhattisgarh Publisher",
    district: "Kawardha",
  },
  {
    id: 8,
    title: "The Gruffalo",
    publisher: "Chhattisgarh Publisher",
    district: "Rajnandgaon",
  },
  {
    id: 9,
    title: "The Tale of Peter Rabbit",
    publisher: "Chhattisgarh Publisher",
    district: "Jangir",
  },
  {
    id: 10,
    title: "Harry Potter and the Sorcerer's Stone",
    publisher: "Chhattisgarh Publisher",
    district: "Champha",
  },
];

// Endpoint to generate a QR code
app.get("/generate-qr", async (req, res) => {
  const qrLink = `http://localhost:${PORT}/scan`;
  try {
    const qr = await QRCode.toDataURL(qrLink);
    // res.send(`
    //   <div style="text-align: center;">
    //     <h1>Scan QR Code</h1>
    //     <p>Scan the QR code below to access the book tracker:</p>
    //     <img src="${qr}" alt="QR Code" />
    //     <p>Or go to: <a href="${qrLink}">${qrLink}</a></p>
    //   </div>
    // `);
    res.send({"qr":qr,"books":books})
  } catch (error) {
    res.status(500).send("Error generating QR code");
  }
});

// Serve the scan page where users enter the book ID
app.get("/scan", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Book Tracker</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          margin-top: 50px;
        }
        form {
          margin: 20px auto;
          display: inline-block;
          text-align: left;
        }
        label {
          display: block;
          margin-bottom: 10px;
        }
        input {
          padding: 10px;
          margin-bottom: 20px;
          width: 100%;
        }
        button {
          padding: 10px 20px;
          background-color: #007BFF;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <h1>Enter Book ID</h1>
      <p>Please enter the book's unique ID to view its destination.</p>
      <form action="/get-book-info" method="get">
        <label for="id">Book ID:</label>
        <input type="number" id="id" name="id" required />
        <button type="submit">Submit</button>
      </form>
    </body>
    </html>
  `);
});

// Endpoint to fetch book details based on ID
app.get("/get-book-info", (req, res) => {
  const { id } = req.query;
  const book = books.find((p) => p.id === parseInt(id));

  if (book) {
    if(book.district === currentLocation){
      res.send(`
        <div style="text-align: center; margin-top: 50px;">
          <h1>Book Found</h1>
          <p>The destination of book ID <strong>${book.title}</strong> is: <strong>${book.district}</strong></p>
          <p>Publisher of the Book is <strong>${book.publisher}</strong></p>
          <h2 style="color:green"><strong>Location Matched!</strong></h2>
          <a href="/scan">Go Back</a>
        </div>
      `);
    }else{
      res.send(`
        <div style="text-align: center; margin-top: 50px;">
          <h1>Book Found</h1>
          <p>The destination of book ID <strong>${book.title}</strong> is: ${book.district}</p>
          <p>Publisher of the Book is <strong>${book.publisher}</strong></p>
          <h2 style="color:red"><strong>Location MisMatched!</strong></h2>
          <a href="/scan">Go Back</a>
        </div>
      `);
    }  
  } else {
    res.send(`
      <div style="text-align: center; margin-top: 50px;">
        <h1>Book Not Found</h1>
        <p>No book found with ID <strong>${id}</strong>.</p>
        <a href="/scan">Try Again</a>
      </div>
    `);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
