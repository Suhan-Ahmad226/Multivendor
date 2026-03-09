import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Blog = () => {
  const posts = [
    {
      title: 'How to find trusted sellers',
      excerpt: 'Tips for checking reviews, ratings, and shop details before you buy.',
    },
    {
      title: 'Getting the best deals on Nittyonjoni',
      excerpt: 'Use wishlists, search filters, and seasonal campaigns to save more.',
    },
    {
      title: 'Secure shopping checklist',
      excerpt: 'Simple steps to keep your account and payments safe.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-[90%] max-w-5xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Blog</h1>
        <p className="text-slate-600 mb-8 max-w-2xl">
          Browse quick guides and tips about using the marketplace. You can later connect this page to a
          real CMS or API.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((p, idx) => (
            <article key={idx} className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-semibold text-lg mb-2">{p.title}</h2>
              <p className="text-sm text-slate-600 mb-3">{p.excerpt}</p>
              <button className="text-sm text-emerald-600 font-medium hover:underline">
                Read more
              </button>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

