import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Profile(){
  const { user: authUser, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    bio: ""
  });
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(()=>{
    loadProfile();
  },[]);

  const loadProfile = async () => {
    try { 
      const res = await api.get("/user/profile"); 
      if (res) {
        setProfile(res);
        setEditData({
          name: res.name || "",
          email: res.email || "",
          bio: res.bio || ""
        });
      } else {
        setProfile(null);
      }
    } catch(e){
      console.error("Failed to load profile:", e);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.put("/user/profile", editData);
      if (res) {
        setProfile(res);
        setEditing(false);
      }
    } catch(e){
      console.error("Failed to update profile:", e);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setImageUploading(true);
      
      console.log("Original file size:", (file.size / 1024 / 1024).toFixed(2), "MB");
      
      // Compress image before uploading
      const compressedImage = await compressImage(file);
      console.log("Compressed image size:", (compressedImage.length / 1024).toFixed(2), "KB");
      
      const res = await api.put("/user/profile", { 
        profilePicture: compressedImage 
      });
      
      if (res) {
        setProfile(res);
        console.log("✅ Image uploaded successfully");
      }
    } catch (error) {
      console.error("💥 Failed to upload image:", error);
      console.error("Error details:", error.response?.data);
      
      if (error.response?.status === 413) {
        alert("Image is still too large after compression. Please try a smaller image.");
      } else {
        alert("Failed to upload image: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setImageUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading profile...</p>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass p-8 rounded-3xl text-center max-w-md">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-2xl font-bold mb-2">Profile Not Found</h3>
        <p className="text-white/70 mb-4">Please try logging in again</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold"
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  const totalAttempts = profile.attempts?.length || 0;
  const avgScore = totalAttempts > 0 
    ? Math.round(profile.attempts.reduce((sum, a) => sum + (a.score / a.total * 100), 0) / totalAttempts)
    : 0;

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-4">
            Your Profile
          </h1>
          <p className="text-white/70 text-lg">Manage your profile and track your learning journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  Account Information
                </h2>
                {!editing ? (
                  <button 
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>✏️</span>
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditing(false);
                        setEditData({
                          name: profile.name || "",
                          email: profile.email || "",
                          bio: profile.bio || ""
                        });
                      }}
                      className="px-4 py-2 border border-white/30 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <span>💾</span>
                          Save
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-white/20">
                    {profile.profilePicture ? (
                      <img 
                        src={profile.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profile.name ? profile.name.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  
                  {/* Edit Image Overlay */}
                  <div 
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={triggerFileInput}
                  >
                    <div className="text-white text-center">
                      <div className="text-2xl">📷</div>
                      <div className="text-xs mt-1">Change Photo</div>
                    </div>
                  </div>

                  {/* Uploading Indicator */}
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="text-center mt-3">
                  <button
                    onClick={triggerFileInput}
                    disabled={imageUploading}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white/80 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                  >
                    {imageUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <span>🖼️</span>
                        Upload Photo
                      </>
                    )}
                  </button>
                  <p className="text-white/50 text-xs mt-2 max-w-xs">
                    Recommended: Square images under 2MB for best results
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/60 text-sm">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({...prev, name: e.target.value}))}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white font-semibold">
                      {profile.name || "No name set"}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-white/60 text-sm">Email Address</label>
                  {editing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({...prev, email: e.target.value}))}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white font-semibold">
                      {profile.email || "No email set"}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-white/60 text-sm">Bio</label>
                  {editing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData(prev => ({...prev, bio: e.target.value}))}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-colors resize-none h-24"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white">
                      {profile.bio || "No bio yet. Click edit to add one!"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
                Learning Statistics
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-cyan-500/20">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{profile.streak || 0}</div>
                  <div className="text-white/70 text-sm">Current Streak</div>
                  <div className="text-cyan-400/80 text-xs mt-1">🔥 Days</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{totalAttempts}</div>
                  <div className="text-white/70 text-sm">Total Attempts</div>
                  <div className="text-purple-400/80 text-xs mt-1">📊 Quizzes</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20">
                  <div className="text-3xl font-bold text-green-400 mb-2">{avgScore}%</div>
                  <div className="text-white/70 text-sm">Average Score</div>
                  <div className="text-green-400/80 text-xs mt-1">🎯 Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-3xl border border-white/10 backdrop-blur-sm h-full">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {profile.attempts && profile.attempts.length > 0 ? (
                  profile.attempts.slice(0, 5).map(attempt => (
                    <div key={attempt._id || attempt.date} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            attempt.type === 'daily' ? 'bg-green-400' : 'bg-purple-400'
                          }`}></div>
                          <span className="font-semibold capitalize">{attempt.type} Quiz</span>
                        </div>
                        <div className="text-sm text-white/60">
                          {new Date(attempt.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-white">
                          {attempt.score}<span className="text-white/40 text-lg">/{attempt.total}</span>
                        </div>
                        <div className="text-sm px-2 py-1 bg-white/10 rounded-full">
                          {Math.round((attempt.score / attempt.total) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/50">
                    <div className="text-4xl mb-3">📝</div>
                    <div className="text-sm">No quiz attempts yet</div>
                    <div className="text-xs mt-1">Start your first quiz!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}