import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [DOB, setDOB] = useState("");
  const [errmsg, setErrmsg] = useState("");
  const [err, setErr] = useState(false);
  const [verified, setVerified] = useState(false);
  // const [phoneNo, setPhoneNo] = useState();
  const backend = import.meta.env.VITE_BACKEND;

  const handleSendOtp = async () => {
    try {
      const res = await fetch(`${backend}/api/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!data.success) {
        setErr(true);
      } else {
        setErr(false);
      }
      setErrmsg(data.message);
    } catch (error) {
      setErr(true);
      setErrmsg(error.message);
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch(`${backend}/api/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, otp: OTP.toString() }),
      });
      const data = await res.json();
      if (!data.success) {
        setErr(true);
      } else {
        setVerified(true);
        setErr(false);
      }
      setErrmsg(data.message);
    } catch (error) {
      setErr(true);
      setErrmsg(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (phoneNo / 1000000000 < 1) {
    //   setErr(true);
    //   setErrmsg("Phone Number must be 10 digits");
    //   return;
    // }
    try {
      const res = await fetch(`${backend}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, DOB }),
      });
      const data = await res.json();
      if (!data.success) {
        setErr(true);
      } else {
        setErr(false);
      }
      setErrmsg(data.message);
      setDOB("");
      setEmail("");
      setName("");
      // setPhoneNo();
      setOTP(0);
    } catch (error) {
      setErr(true);
      setErrmsg(error.message);
    }
  };

  useEffect(() => {
    if (errmsg) {
      const timer = setTimeout(() => {
        setErr(false);
        setErrmsg("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errmsg]);

  return (
    <div className="main flex flex-col items-center min-h-screen text-white font-bold text-xl bg-gradient-to-t from-sky-500 to-indigo-500">
      <div className="heading p-5 mt-5 text-3xl">Birthday Wisher</div>
      <div className="content w-full max-w-md">
        <form
          className="form flex flex-col gap-4 text-white p-5 bg-white/10 rounded-md"
          onSubmit={handleSubmit}
        >
          {errmsg && (
            <div
              className={`error w-full p-3 rounded-xl ${
                err ? "bg-red-700/80" : "bg-green-700/80"
              }`}
            >
              {errmsg}
            </div>
          )}

          <div className="form-group flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              name="name"
              id="name"
              className="p-2 border-2 border-white bg-black/20 rounded text-black"
            />
          </div>

          <div className="sendOtp">
            <div className="form-group flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                id="email"
                className="p-2 border-2 border-white bg-black/20 rounded text-black"
              />
            </div>
            <button
              type="button"
              onClick={handleSendOtp}
              className="bg-black/60 p-2 rounded-b-lg"
            >
              Send OTP
            </button>
          </div>

          <div className="form-group flex flex-col">
            <label htmlFor="otp">
              Enter the 6 digit OTP <p className="text-sm">(May be in Spam)</p>
            </label>
            <input
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              type="number"
              name="otp"
              id="otp"
              className="p-2 border-2 border-white bg-black/20 rounded text-black"
            />
          </div>
          <button
            type="button"
            onClick={handleVerify}
            className="bg-black/60 cursor-pointer rounded-2xl p-3"
          >
            Verify
          </button>
          {/* <div className="form-group flex flex-col">
            <label htmlFor="ph">Phone Number</label>
            <input
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              type="text"
              name="ph"
              id="ph"
              className="p-2 border-2 border-white bg-black/20 rounded text-black"
            />
          </div> */}
          <div className="form-group flex text-white flex-col">
            <label htmlFor="dob">Date of Birth</label>
            <input
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              type="date"
              name="dob"
              id="dob"
              className="p-2 rounded text-white/90"
            />
          </div>

          <button
            type="submit"
            disabled={!verified}
            className={`bg-indigo-700 ${
              verified ? `hover : bg - indigo - 900` : ""
            }  p-2 rounded mt-3`}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
