import { JSX, useState, useEffect } from 'react';
import {
    FaArrowRight,
    FaNewspaper,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaEnvelope,
    FaUser,
    FaCalendarAlt
} from 'react-icons/fa';
// Assuming your Carousel component exists here
import { Carousel, CarouselItem } from './ui/carousel';
import backend from "~backend/client";

// Types for the backend data
type Announcement = {
    image: string;
    title: string;
    date: string;
    author: string;
    content: string;
};

export default function LandingPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        // Simulating: fetch from backend.announcements
        //setAnnouncements(mockAnnouncements);
        fetchAnnouncements();
    }, []);

    const convert = (data: any[]): Announcement[] => {
        return data.map(item => ({
            image: item.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image',
            title: item.title,
            date: new Date(item.createdAt).toLocaleDateString(),
            author: item.createdBy || 'Unknown',
            content: item.content,
        }));
    }

    const fetchAnnouncements = async () => {
        const response = await backend.announcement.list();
        setAnnouncements(convert(response.announcements));
    };

    const heroImages = [
        '/images/4.jpg',
        '/images/2.jpg',
        '/images/1.jpg',
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* --- NAVIGATION BAR --- */}
            <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-3">
                        <img src="https://i.ibb.co/dyTvpky/2.png" className="h-12 w-auto" alt="logo" />
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-slate-800 leading-none">NO-HE</span>
                            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Cement Investment</span>
                        </div>
                    </a>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#about" className="text-sm font-semibold hover:text-primary transition-colors">About</a>
                        <a href="#announcements" className="text-sm font-semibold hover:text-primary transition-colors">Announcements</a>
                        <a href="#contact" className="text-sm font-semibold hover:text-primary transition-colors">Contact</a>
                        <a
                            href="/login"
                            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary transition-all shadow-md active:scale-95"
                        >
                            Inventory Login <FaArrowRight className="text-xs" />
                        </a>
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                {/* --- HERO SECTION WITH SLIDER --- */}
                <section className="relative h-[85vh] overflow-hidden bg-black">
                    <div className="absolute inset-0 opacity-60">
                        <Carousel autoplay delay={3000} className="h-full w-full">
                            {heroImages.map((src, i) => (
                                <CarouselItem key={i} className="h-[85vh] w-full">
                                    <img src={src} alt={`Slide ${i}`} className="w-full h-full object-cover" />
                                </CarouselItem>
                            ))}
                        </Carousel>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
                        <div className="max-w-3xl space-y-6">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-white border border-white/30 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                                Establishing Foundations since 2010
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
                                Nohi Cement Products Investment <span className="text-warning">Arbaminch</span>
                            </h1>
                            <p className="text-lg text-slate-200 max-w-xl leading-relaxed">
                                Premium cement products and construction solutions engineered for durability, reliability, and sustainable growth.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <button className="px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-lg hover:brightness-110 transition-all">
                                    Explore Products
                                </button>
                                <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                                    View Projects
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- ANNOUNCEMENTS SECTION --- */}
                <section id="announcements" className="py-24 container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm">
                                <FaNewspaper /> <span>Latest Updates</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-800">Company Announcements</h2>
                        </div>
                        <p className="text-slate-500 max-w-md">
                            Stay informed with the latest news, project milestones, and corporate updates from NO-HE Investment.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {announcements.map((post, idx) => (
                            <article key={idx} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-[10px] font-black uppercase text-slate-800">
                                        News
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1"><FaCalendarAlt /> {post.date}</span>
                                        <span className="flex items-center gap-1"><FaUser /> {post.author}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                                        {post.content}
                                    </p>
                                    <button className="text-primary font-bold text-sm flex items-center gap-2 pt-2 group-hover:gap-4 transition-all">
                                        Read More <FaArrowRight />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            {/* --- FOOTER --- */}
            <footer id="contact" className="bg-slate-900 text-slate-300 pt-20 pb-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1 space-y-6">
                            <div className="flex items-center gap-3">
                                <img src="https://i.ibb.co/dyTvpky/2.png" className="h-10 w-auto" alt="logo" />
                                <span className="text-xl font-black tracking-tight">NO-HE</span>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-400">
                                Leading the way in construction material innovation across Ethiopia since 2010. Excellence in every ton.
                            </p>
                        </div>

                        <div className="space-y-4 hidden">
                            <h4 className="text-white font-bold text-lg">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-primary transition-colors">Corporate Profile</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Product Catalogue</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
                                <li><a href="/login" className="hover:text-primary transition-colors text-primary font-bold">Inventory Portal</a></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-white font-bold text-lg">Contact Details</h4>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3">
                                    <FaMapMarkerAlt className="mt-1 text-primary" />
                                    <span>Sikela Adebabay, Arba Minch,<br /> Gamo Zone, Ethiopia</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FaPhoneAlt className="text-primary" />
                                    <span>+251 988 05 09 71</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FaEnvelope className="text-primary" />
                                    <span>info@nohe-investment.com</span>
                                </li>
                            </ul>
                        </div>

                        {/* <div className="space-y-4">
                            <h4 className="text-white font-bold text-lg">Newsletter</h4>
                            <p className="text-xs text-slate-400 italic">Get the latest project updates in your inbox.</p>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="bg-slate-800 border-none rounded px-4 py-2 text-sm w-full focus:ring-1 ring-primary"
                                />
                                <button className="bg-primary px-4 py-2 rounded text-white hover:brightness-110 transition-all">
                                    Join
                                </button>
                            </form>
                        </div> */}
                    </div>
                </div>
            </footer>
        </div>
    );
}