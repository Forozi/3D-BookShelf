import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, invalidate } from '@react-three/fiber';
import { OrbitControls, Environment, BakeShadows  } from '@react-three/drei';
import Bookshelf from './components/Bookshelf';
import WindowView from './components/WindowView';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { api } from './api/api';
import './App.css'; 
import Room from './components/Room';
import { Perf } from 'r3f-perf';

export default function App() {
  // --- STATE ---
  const [library, setLibrary] = useState([]); 
  const [user, setUser] = useState(null); 
  const [currentView, setCurrentView] = useState('home'); 
  const [isLoading, setIsLoading] = useState(false);
  
  // --- 3D INTERACTION STATE ---
  const [activeBookId, setActiveBookId] = useState(null);
  const [isOpened, setIsOpened] = useState(false);
  const busyRef = useRef(false);
  const controlsRef = useRef();

  // --- INITIAL SESSION CHECK ---
  useEffect(() => {
    const storedUser = api.getCurrentUser();
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(storedUser);
    }
  }, []);

  // --- FETCH DATA ON USER CHANGE ---
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      api.fetchAllBooks()
        .then(data => {
          setLibrary(data);
          invalidate(); 
        })
        .catch(err => console.error("Failed to fetch books:", err))
        .finally(() => setIsLoading(false));
    } else {
      setLibrary([]); 
    }
  }, [user]);

  // --- HANDLERS ---
  const handleAddBook = async (newBookData) => {
    if(busyRef.current) return;
    
    try {
      const response = await api.createBook(newBookData);
      if (response.success && response.book) {
        setLibrary((prev) => [...prev, response.book]);
        invalidate(); 
      }
    } catch (error) {
      console.error("Failed to add book:", error);
      alert("Error adding book to database.");
    }
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setCurrentView('home');
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setLibrary([]); 
    setCurrentView('home');

    setActiveBookId(null);
    setIsOpened(false);
    busyRef.current = false; 

    if (controlsRef.current) {
        controlsRef.current.object.position.set(0, 0, 8); 
        controlsRef.current.target.set(0, 0, 0);          
        controlsRef.current.update();
    }
    
    invalidate();
  };

  return (
    <div className="app-root">
      
      <header className="app-header">
        <div className="app-logo" onClick={() => setCurrentView('home')}>
          BỘ SƯU TẬP CÁ NHÂN
        </div>
        
        <div className="app-nav-group">
          {user ? (
             <>
                <span className="app-welcome-text">
                  Xin chào, <strong>{user.name}</strong>
                </span>
                <button className="app-btn" onClick={handleLogout}>Đăng xuất</button>
             </>
          ) : (
            <>
              <button className="app-btn" onClick={() => setCurrentView('login')}>Đăng nhập</button>
              <button className="app-btn-primary" onClick={() => setCurrentView('register')}>Đăng ký</button>
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="app-canvas-container">
          
          {isLoading && <div className="app-loader">Đang tải dữ liệu ...</div>}

          <Canvas dpr={0.5} frameloop="demand" camera={{ position: [0, 0, 8], fov: 45 }} gl={{ powerPreference: "low-power" }}>
            
            <BakeShadows />
            {/* <Perf position="top-left" /> */}

            <ambientLight intensity={1.2} /> 
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            
            <Room />

            <Suspense fallback={null}>
              <Bookshelf 
                books={library} 
                onAddBook={handleAddBook} 
                activeBookId={activeBookId}
                busyRef={busyRef}
                setActiveBookId={setActiveBookId}
                setIsOpened={setIsOpened}
                controlsRef={controlsRef}
                defaultCam={[0, 0, 8]}
                defaultTarget={[0, 0, 0]}
                position={[0, 0, 0]} 
                rotation={[0, 0, 0]}
                isLoggedIn={!!user} 
              />
            </Suspense>

            <WindowView 
                position={[20, 7, 10]} 
                rotation={[0, Math.PI/2, 0]}  
                scale={[40, 20, 1]}    
            />

            <OrbitControls 
              ref={controlsRef}
              enableDamping={false}
              enablePan={false}
              enableRotate={!activeBookId} 
              minPolarAngle={Math.PI / 4} 
              maxPolarAngle={Math.PI / 1.4}
              enabled={!isOpened && currentView === 'home'} 
              onChange={() => invalidate()} 
            />
            
          </Canvas>
        </div>
      </main>

      {currentView === 'login' && (
        <LoginPage onLogin={handleLogin} onCancel={() => setCurrentView('home')} />
      )}
      {currentView === 'register' && (
        <RegisterPage onRegister={handleLogin} onCancel={() => setCurrentView('home')} />
      )}

    </div>
  );
}