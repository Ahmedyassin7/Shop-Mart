export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-md">
      <span className="loader" />
    </div>
  );
}
