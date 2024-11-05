export default function UnprocessableContent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 p-4">
      <div className="card h-full w-auto">
        <figure>
          <img src="/warning.gif" alt="warning" width={114} />
        </figure>
        <div className="card-body text-center">
          <h1 className="text-center text-gray-600 font-bold text-xl">
            Invalid Email!
          </h1>
          <p className="text-gray-500">
            Fligno email is only supported as login
          </p>
          <div className="card-actions justify-center mt-12">
            <button className="btn btn-primary">Back to Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}
