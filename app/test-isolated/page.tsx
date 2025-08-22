export default function TestIsolated() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'blue' }}>Isolated Test Page</h1>
      <p>This page bypasses all providers and complex components.</p>
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <p>If you can see this styled content, the basic Next.js setup is working.</p>
        <p>Current time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}
