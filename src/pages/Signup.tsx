import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");
    const res = await fetch("http://localhost:3000/api/v1/Signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!data.err) {
      localStorage.setItem("token", data.token);
      navigate("/");
    }
    console.log(data);
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
        <button className="bg-blue-300 h-16 w-64 rounded-2xl">Signup</button>
      </form>
      <p>
        {" "}
        Already have a Account?
        <button
          onClick={() => navigate("/signin")}
          className="underline text-[18px] text-green-300"
        >
          Signin
        </button>
      </p>
    </div>
  );
};

export default Signup;
