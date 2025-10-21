

import Link from 'next/link';
import SignIn from './components/auth/signin-button';


const HomePage = () => {
  

  return (
  
<>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative hero-pattern pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-pink-50/50 to-orange-50/50"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in-up drop-shadow-md">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Create your
              <span className="text-gradient-home block">Personal Page</span>
              your way
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-2xl mx-auto">
              Stand out with a professional and personalized digital presence. No hassle, no code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
             
                <Link
                  href="/p/create"
                  className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/50"
                >
                  Get Started
                </Link>     
              <SignIn  > 
                        
              </SignIn>
            
              
            </div>
          </div>
        </div>
        
      </section>
      
</>
  );
};

export default HomePage;
