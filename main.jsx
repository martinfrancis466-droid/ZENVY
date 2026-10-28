import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  House, Compass, PlusSquare, MessageCircle, UserRound, Search, Heart,
  MessageSquare, Share2, MoreHorizontal, Image as ImageIcon, Video,
  X, Send, Play, Sparkles, Menu, Bell, ArrowLeft, Check, AtSign
} from "lucide-react";
import "./styles.css";

const SEED_POSTS = [
  {
    id: "p1", name: "Amani Juma", handle: "@amanij", avatar: "AJ",
    time: "12 min ago", text: "Small steps every day still move you forward. 🌱 What are you working on this week?",
    media: null, likes: 18, liked: false,
    comments: [{ id: "c1", name: "Neema", text: "Needed this reminder 💛" }]
  },
  {
    id: "p2", name: "Zuri M.", handle: "@zurim", avatar: "ZM",
    time: "38 min ago", text: "Golden hour, good energy. ✨",
    media: { type: "image", url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85" },
    likes: 42, liked: false, comments: []
  },
  {
    id: "p3", name: "Kito Creates", handle: "@kitocreates", avatar: "KC",
    time: "1 hr ago", text: "A little creative break. What should I make next?",
    media: { type: "image", url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85" },
    likes: 27, liked: false, comments: []
  }
];

const PEOPLE = [
  { name: "Amani Juma", handle: "@amanij", avatar: "AJ", bio: "Learning, building, growing 🌱" },
  { name: "Zuri M.", handle: "@zurim", avatar: "ZM", bio: "Photos, places & little moments ✨" },
  { name: "Kito Creates", handle: "@kitocreates", avatar: "KC", bio: "Art • design • ideas" },
  { name: "Neema P.", handle: "@neemap", avatar: "NP", bio: "Making ordinary days special ☀️" }
];

function readPosts() {
  try {
    const saved = localStorage.getItem("zenvy.posts.v1");
    if (saved) return JSON.parse(saved);
  } catch {}
  return SEED_POSTS;
}

function Avatar({ initials, size = "normal" }) {
  return <div className={`avatar avatar-${size}`}>{initials}</div>;
}

function App() {
  const [posts, setPosts] = useState(readPosts);
  const [page, setPage] = useState("Home");
  const [query, setQuery] = useState("");
  const [composerText, setComposerText] = useState("");
  const [media, setMedia] = useState(null);
  const [commentFor, setCommentFor] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [following, setFollowing] = useState([]);
  const [activeChat, setActiveChat] = useState("Amani Juma");
  const fileRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem("zenvy.posts.v1", JSON.stringify(posts)); } catch {}
  }, [posts]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(p => `${p.name} ${p.handle} ${p.text}`.toLowerCase().includes(q));
  }, [posts, query]);

  function chooseMedia(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setNotice("Please choose an image or video file.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setNotice("For this demo, choose a file smaller than 12 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    setMedia({ type: file.type.startsWith("video/") ? "video" : "image", url, name: file.name });
    e.target.value = "";
  }

  function publish() {
    if (!composerText.trim() && !media) {
      setNotice("Write something or attach a photo/video first.");
      return;
    }
    const newPost = {
      id: `p${Date.now()}`, name: "You", handle: "@you", avatar: "YO",
      time: "Just now", text: composerText.trim(), media, likes: 0, liked: false, comments: []
    };
    setPosts(prev => [newPost, ...prev]);
    setComposerText("");
    setMedia(null);
    setPage("Home");
    setNotice("Your post was added on this device.");
  }

  function toggleLike(id) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p));
  }

  function addComment() {
    if (!commentText.trim() || !commentFor) return;
    setPosts(prev => prev.map(p => p.id === commentFor ? {
      ...p, comments: [...(p.comments || []), { id: `c${Date.now()}`, name: "You", text: commentText.trim() }]
    } : p));
    setCommentText("");
    setNotice("Comment added.");
  }

  function toggleFollow(handle) {
    setFollowing(prev => prev.includes(handle) ? prev.filter(x => x !== handle) : [...prev, handle]);
  }

  const navItems = [
    { label: "Home", icon: House },
    { label: "Discover", icon: Compass },
    { label: "Create", icon: PlusSquare },
    { label: "Messages", icon: MessageCircle },
    { label: "Profile", icon: UserRound }
  ];

  function navigate(label) {
    setPage(label);
    setMobileNav(false);
    if (label === "Create") setTimeout(() => document.getElementById("post-composer")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <button className="brand" onClick={() => navigate("Home")} aria-label="ZENVY home">
          <span className="brand-mark">z</span><span>ZENVY</span>
        </button>
        <div className="side-caption">YOUR SPACE</div>
        <nav className="main-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${page === label ? "active" : ""}`} onClick={() => navigate(label)}>
              <Icon size={20} strokeWidth={page === label ? 2.5 : 2} /><span>{label}</span>
              {label === "Messages" && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-profile"><Avatar initials="YO" /><div><b>You</b><span>@you</span></div><MoreHorizontal size={18} /></div>
          <div className="side-note"><Sparkles size={16} /><span>Share your world.<br />Find your people.</span></div>
        </div>
      </aside>

      {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}

      <main className="main-column">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu /></button>
          <div className="mobile-brand"><span className="brand-mark">z</span> ZENVY</div>
          <div className="topbar-title">{page === "Create" ? "Create a post" : page}</div>
          <button className="icon-btn notification-btn" onClick={() => setNotice("You're all caught up.")} aria-label="Notifications"><Bell size={19} /></button>
        </header>

        {page === "Home" && (
          <>
            <section className="welcome-strip">
              <div><div className="eyebrow">TUESDAY, YOUR WAY</div><h1>Your world, <span>your vibe.</span></h1><p>Catch up with people and moments you care about.</p></div>
              <div className="welcome-spark">✦</div>
            </section>
            <section className="stories-section">
              <div className="section-heading"><h2>Stories</h2><button className="text-button" onClick={() => setNotice("Stories publishing will be added in a later version.")}>See all</button></div>
              <div className="stories-row">
                <button className="story add-story" onClick={() => setNotice("Stories are planned for a later version.")}><span className="story-ring add-ring"><span>+</span></span><span>Your story</span></button>
                {PEOPLE.slice(0, 4).map((p, i) => <button className="story" key={p.handle} onClick={() => setNotice(`${p.name}'s story demo is coming soon.`)}><span className={`story-ring story-${i}`}><Avatar initials={p.avatar} /></span><span>{p.name.split(" ")[0]}</span></button>)}
              </div>
            </section>
            <section className="composer card" id="post-composer">
              <div className="composer-top"><Avatar initials="YO" /><textarea value={composerText} onChange={e => setComposerText(e.target.value)} placeholder="What's happening in your world?" rows="2" /></div>
              {media && <div className="media-preview">
                {media.type === "image" ? <img src={media.url} alt="Selected upload preview" /> : <video src={media.url} controls />}
                <button className="remove-media" onClick={() => setMedia(null)} aria-label="Remove media"><X size={16} /></button>
              </div>}
              <div className="composer-bottom">
                <div className="attach-actions">
                  <button onClick={() => { fileRef.current?.setAttribute("accept", "image/*"); fileRef.current?.click(); }}><ImageIcon size={18} /><span>Photo</span></button>
                  <button onClick={() => { fileRef.current?.setAttribute("accept", "video/*"); fileRef.current?.click(); }}><Video size={18} /><span>Video</span></button>
                  <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={chooseMedia} />
                </div>
                <button className="primary-btn" onClick={publish}><Send size={15} /> Post</button>
              </div>
            </section>
            <div className="feed-heading"><h2>For you</h2><button className="filter-pill" onClick={() => setNotice("Showing the latest demo posts.")}>Latest <span>⌄</span></button></div>
            <Feed posts={filteredPosts} onLike={toggleLike} onComment={id => setCommentFor(id)} />
          </>
        )}

        {page === "Discover" && (
          <section className="page-content">
            <div className="page-intro"><div className="eyebrow">EXPLORE ZENVY</div><h1>Find your people.</h1><p>Discover creators, ideas, and moments.</p></div>
            <label className="search-box"><Search size={19} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search posts or people..." /></label>
            <h2 className="block-title">People you may like</h2>
            <div className="people-list">{PEOPLE.map(p => <div className="person-card" key={p.handle}><Avatar initials={p.avatar} size="large" /><div className="person-info"><b>{p.name}</b><span>{p.handle}</span><p>{p.bio}</p></div><button className={following.includes(p.handle) ? "follow-btn following" : "follow-btn"} onClick={() => toggleFollow(p.handle)}>{following.includes(p.handle) ? <><Check size={15} /> Following</> : "Follow"}</button></div>)}</div>
            <h2 className="block-title">Posts to explore</h2><Feed posts={filteredPosts} onLike={toggleLike} onComment={id => setCommentFor(id)} />
          </section>
        )}

        {page === "Create" && (
          <section className="page-content">
            <div className="page-intro"><div className="eyebrow">MAKE A MOMENT</div><h1>Create something.</h1><p>Share a thought, photo, or video with your world.</p></div>
            <div className="create-hint"><PlusSquare size={22} /><div><b>Ready when you are</b><p>Use the composer on Home to write a post or attach media.</p></div><button className="primary-btn" onClick={() => navigate("Home")}>Go to composer</button></div>
          </section>
        )}

        {page === "Messages" && (
          <section className="page-content messages-page">
            <div className="page-intro"><div className="eyebrow">STAY CONNECTED</div><h1>Your conversations.</h1><p>This first version shows a messaging preview. Live delivery comes later.</p></div>
            <div className="chat-layout">
              <div className="chat-list">{PEOPLE.slice(0, 3).map((p, i) => <button className={`chat-person ${activeChat === p.name ? "chat-active" : ""}`} key={p.handle} onClick={() => setActiveChat(p.name)}><Avatar initials={p.avatar} /><div><b>{p.name}</b><span>{["Hey! How's your project going?","Loved your latest photo ✨","Let's catch up soon"][i]}</span></div></button>)}</div>
              <div className="chat-window"><div className="chat-header"><Avatar initials={(PEOPLE.find(p => p.name === activeChat) || PEOPLE[0]).avatar} /><div><b>{activeChat}</b><span>Demo conversation</span></div></div><div className="chat-empty"><div className="chat-bubble">Hey! How's your project going?</div><div className="chat-bubble mine">It's coming along. Thanks for asking! ✨</div><div className="chat-bubble">Can't wait to see it.</div><p>Demo messages only — not sent to real users.</p></div><form className="chat-input" onSubmit={e => { e.preventDefault(); setNotice("Live messaging isn't connected in this MVP."); }}><input placeholder="Write a message..." /><button className="primary-btn" aria-label="Send message"><Send size={16} /></button></form></div>
            </div>
          </section>
        )}

        {page === "Profile" && (
          <section className="page-content">
            <div className="profile-cover"><div className="cover-orb orb-one" /><div className="cover-orb orb-two" /></div>
            <div className="profile-header"><Avatar initials="YO" size="profile" /><button className="outline-btn" onClick={() => setNotice("Profile editing will be added in a later version.")}>Edit profile</button></div>
            <h1 className="profile-name">You</h1><div className="profile-handle">@you</div><p className="profile-bio">New here. Sharing my world on ZENVY ✨</p>
            <div className="profile-stats"><div><b>{posts.filter(p => p.handle === "@you").length}</b><span>Posts</span></div><div><b>{following.length}</b><span>Following</span></div><div><b>0</b><span>Followers</span></div></div>
            <div className="feed-heading"><h2>Your posts</h2></div>
            <Feed posts={posts.filter(p => p.handle === "@you")} onLike={toggleLike} onComment={id => setCommentFor(id)} emptyText="Your posts will show up here." />
          </section>
        )}

        <footer className="footer-note">ZENVY MVP <span>•</span> Made for your world <span>•</span> v1.0</footer>
      </main>

      <aside className="right-column">
        <label className="search-box global-search"><Search size={18} /><input value={query} onChange={e => { setQuery(e.target.value); if (e.target.value) setPage("Discover"); }} placeholder="Search ZENVY" /></label>
        <section className="side-card trend-card"><div className="section-heading"><h2>Trending now</h2><Sparkles size={17} /></div><div className="trend-item"><span>01 · COMMUNITY</span><b>#SmallWins</b><small>1.2k posts</small></div><div className="trend-item"><span>02 · CREATIVE</span><b>#MadeToday</b><small>846 posts</small></div><div className="trend-item"><span>03 · LIFESTYLE</span><b>#GoodEnergy</b><small>624 posts</small></div><button className="text-button" onClick={() => navigate("Discover")}>Explore trends →</button></section>
        <section className="side-card suggestions-card"><div className="section-heading"><h2>People to follow</h2><button className="text-button" onClick={() => navigate("Discover")}>See all</button></div>{PEOPLE.slice(0, 3).map(p => <div className="suggestion" key={p.handle}><Avatar initials={p.avatar} /><div><b>{p.name}</b><span>{p.handle}</span></div><button className="tiny-follow" onClick={() => toggleFollow(p.handle)}>{following.includes(p.handle) ? "✓" : "+"}</button></div>)}</section>
        <div className="right-footer">About · Privacy · Terms<br />© 2026 ZENVY</div>
      </aside>

      <nav className="mobile-bottom-nav">{navItems.filter(n => n.label !== "Create").map(({label, icon: Icon}) => <button key={label} className={page === label ? "active" : ""} onClick={() => navigate(label)}><Icon size={20} /><span>{label}</span></button>)}<button onClick={() => navigate("Create")}><PlusSquare size={20} /><span>Create</span></button></nav>

      {commentFor && <div className="modal-backdrop" onClick={() => setCommentFor(null)}><section className="comment-modal" onClick={e => e.stopPropagation()}><div className="modal-heading"><h2>Comments</h2><button className="icon-btn" onClick={() => setCommentFor(null)}><X size={18} /></button></div><div className="comments-list">{(posts.find(p => p.id === commentFor)?.comments || []).map(c => <div className="comment-row" key={c.id}><Avatar initials={c.name.slice(0, 2).toUpperCase()} /><div><b>{c.name}</b><p>{c.text}</p></div></div>)}{!(posts.find(p => p.id === commentFor)?.comments || []).length && <p className="empty-comments">Be the first to comment.</p>}</div><form className="comment-form" onSubmit={e => { e.preventDefault(); addComment(); }}><input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a comment..." autoFocus /><button className="primary-btn" type="submit"><Send size={15} /></button></form></section></div>}

      {notice && <div className="toast"><Check size={16} />{notice}</div>}
    </div>
  );
}

function Feed({ posts, onLike, onComment, emptyText = "No posts found. Try another search." }) {
  if (!posts.length) return <div className="empty-feed"><Sparkles size={22} /><p>{emptyText}</p></div>;
  return <div className="feed-list">{posts.map(post => <article className="post-card card" key={post.id}>
    <div className="post-head"><Avatar initials={post.avatar} /><div className="post-author"><b>{post.name}</b><span>{post.handle} <span className="post-dot">·</span> {post.time}</span></div><button className="icon-btn more-btn" aria-label="More post options"><MoreHorizontal size={20} /></button></div>
    {post.text && <p className="post-text">{post.text}</p>}
    {post.media && <div className="post-media">{post.media.type === "video" ? <video src={post.media.url} controls playsInline /> : <img src={post.media.url} alt="Post media" loading="lazy" />}</div>}
    <div className="post-actions"><button className={post.liked ? "liked" : ""} onClick={() => onLike(post.id)}><Heart size={19} fill={post.liked ? "currentColor" : "none"} /><span>{post.likes}</span></button><button onClick={() => onComment(post.id)}><MessageSquare size={19} /><span>{post.comments?.length || 0}</span></button><button onClick={() => { try { navigator.clipboard?.writeText(`${post.name}: ${post.text}`); } catch {} }}><Share2 size={18} /><span>Share</span></button></div>
    {(post.comments || []).length > 0 && <button className="view-comments" onClick={() => onComment(post.id)}>View {post.comments.length} comment{post.comments.length === 1 ? "" : "s"}</button>}
  </article>)}</div>;
}

createRoot(document.getElementById("root")).render(<App />);
