import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '100vh',
      paddingTop: '10vh',
      textAlign: 'center'
    }}>
      <h1>404</h1>
      <h2>Oops.. Page Not Found</h2>
      <Link to="/">Back to Home Page</Link>
    </div>
  );
}

export default ErrorPage;