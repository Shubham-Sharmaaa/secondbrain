import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    const res = await fetch("http://localhost:3000/api/v1/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    console.log(data);
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/");
    }
  }
  return (
    <div className="h-screen flex flex-col justify-center items-center min-h-64 ">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          className=" h-12 w-64 bg-gray-300 rounded-lg text-center"
          type="text"
          name="username"
          placeholder="Enter username"
        />
        <input
          className=" h-12 w-64 bg-gray-300 rounded-lg text-center"
          type="text"
          name="password"
          placeholder="Enter password"
        />
        <button className="bg-blue-300 h-16 w-64 rounded-2xl">Signin</button>
      </form>
      <p>
        {" "}
        Not have a Account?
        <button
          onClick={() => navigate("/signup")}
          className="underline text-[18px] text-green-300"
        >
          Signup
        </button>
      </p>
    </div>
  );
};

export default Signin;
