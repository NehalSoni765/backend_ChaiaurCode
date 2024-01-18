import expres from "express";
import cors from "cors";

const app = expres();
const port = 3000;

app.use(expres.static("dist"));

// app.use(cors());
const corsOptions = {
  origin: "https://localhost:5173",
};

// app.get("/", (req, res) => res.send("Hello WOrld"));
app.get("/api/jokes", cors(corsOptions), (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "A joke",
      content: "This is a joke",
    },
    {
      id: 2,
      title: "Another joke",
      content: "This is another joke",
    },
    {
      id: 3,
      title: "Third joke",
      content: "This is third joke",
    },
    {
      id: 1,
      title: "Forth joke",
      content: "This is forth joke",
    },
    {
      id: 1,
      title: "Fifth joke",
      content: "This is fifth joke",
    },
  ];
  res.send(jokes);
});

app.listen(port || 3000, () => console.log("Listening the port " + port));
