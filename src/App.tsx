import Header from './components/Header';
import Playground from './pages/Playground';

function App() {
  return (
    <>
      <div className="w-screen h-screen bg-gray-200 flex flex-col">
        <Header />
        <Playground />
      </div>
    </>
  );
}

export default App;
