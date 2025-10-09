

const HomePage = () => {


  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-pink-50 text-gray-900 min-h-screen overflow-hidden relative">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .gradient-border {
          background: linear-gradient(45deg, #f97316, #ec4899, #f97316);
          padding: 2px;
          border-radius: 12px;
        }
        .gradient-border-content {
          background: white;
          border-radius: 10px;
        }
        .text-gradient-home {
          background: linear-gradient(135deg, #ec4899, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(236, 72, 153, 0.2);
        }
        .navbar-blur {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .hero-pattern {
          background-image:
            radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%);
        }
        #mobile-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
          opacity: 0;
        }
        #mobile-menu.show {
          max-height: 200px;
          opacity: 1;
        }
      `}</style>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative hero-pattern pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-pink-50/50 to-orange-50/50"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Create your
              <span className="text-gradient-home block">Personal Page</span>
              your way
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-2xl mx-auto">
              Stand out with a professional and personalized digital presence. No hassle, no code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pg/create"
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/50"
              >
                Get Started
              </a>
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
