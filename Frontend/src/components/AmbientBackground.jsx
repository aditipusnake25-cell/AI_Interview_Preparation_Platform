function AmbientBackground() {
  return (
    <div className="ambient-background" aria-hidden="true">
      {Array.from({ length: 10 }, (_, index) => (
        <span key={index} className="ambient-particle" />
      ))}
    </div>
  );
}

export default AmbientBackground;
