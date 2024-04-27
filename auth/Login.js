export default function Login() {
    return (
        <div>
        <div>
            <h1>Sign In</h1>
            <form>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" />
            <button type="submit">Sign In</button>
            </form>
        </div>
        </div>
    );
}