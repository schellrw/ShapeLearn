# ShapeLearn - Math Visualization PoC

An innovative educational platform that transforms arithmetic into interactive 3D visualizations for children ages 5-10. Watch numbers come to life as unique shapes that combine and transform to teach mathematical concepts through visual-spatial learning.

## 🎯 What This PoC Demonstrates

- **3D Number Shapes**: Each number (0-20) has a unique 3D shape designed for visual learning
- **Interactive Math Operations**: Watch addition and subtraction through shape transformations
- **Complementary Pairs**: Special animations for number pairs that add to 10 (3+7, 2+8, etc.)
- **Child-Friendly Interface**: Large touch targets, encouraging messages, and intuitive interactions
- **Responsive 3D Graphics**: Smooth Three.js animations optimized for tablets and mobile

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Three.js + Tailwind CSS
- **Backend**: Python Flask with math shape engine
- **3D Engine**: React Three Fiber for WebGL rendering
- **API**: RESTful endpoints for shape data and calculations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create environment file:**
   ```bash
   # Copy the example file (create .env manually if needed)
   # Add these contents to .env:
   FLASK_DEBUG=true
   PORT=5000
   FLASK_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the Flask server:**
   ```bash
   python app.py
   ```
   
   The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   The default configuration should work for local development.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

## 🎮 Using the PoC

### Math Visualization Demo
1. **Select numbers** (0-20) for your math problem
2. **Choose operation** (addition or subtraction)
3. **Click "See the Magic!"** to watch the 3D transformation
4. **Try complementary pairs** (like 3+7) for special animations!

### Shape Gallery
1. **Click any number** (0-20) to see its unique 3D shape
2. **Drag to rotate** and scroll to zoom
3. **Learn about each shape** with fun facts and descriptions

## 🔧 API Endpoints

- `GET /health` - Health check
- `GET /api/shapes` - Get all number shapes (0-20)
- `GET /api/shapes/{number}` - Get specific number shape
- `POST /api/operation` - Calculate math operations with transformations
- `POST /api/practice` - Generate practice problems (future feature)

## 🎨 Key Features Demonstrated

### Shape-Based Learning
- Each digit has a distinctive 3D form
- Visual relationships between complementary numbers
- Compound shapes for two-digit numbers (10-20)

### Child-Friendly Design
- Large touch targets (44px minimum)
- High contrast colors and clear typography
- Encouraging, positive feedback messages
- No error blame - always supportive

### Mathematical Concepts
- **Addition**: Numbers flow together and merge into result
- **Subtraction**: Larger number transforms as smaller number phases through
- **Base-10 relationships**: Visual complementary pairs (1↔9, 2↔8, 3↔7, 4↔6, 5↔5)
- **Number sense**: Understanding quantities through spatial visualization

## 🎯 Educational Philosophy

This PoC implements core principles from educational research:

- **Visual-Spatial Learning**: Leverages children's natural spatial intelligence
- **Constructivist Approach**: Children build understanding through manipulation
- **Multi-sensory Engagement**: Touch, visual, and eventually audio feedback
- **Intrinsic Motivation**: Learning for the joy of discovery, not external rewards

## 🔮 Future Expansion

This PoC sets the foundation for:

- **Advanced Operations**: Multiplication, division, fractions
- **Reading Integration**: Phonics with shape-sound associations  
- **Parent Dashboard**: Progress tracking and celebration tools
- **AI Personalization**: Adaptive difficulty and homework analysis
- **Classroom Features**: Teacher tools and progress reporting

## 🏆 Success Metrics

Early indicators this PoC tracks:
- **Engagement**: Time spent exploring shapes and operations
- **Understanding**: Accuracy in predicting complementary pairs
- **Enthusiasm**: Repeated use and exploration patterns
- **Accessibility**: Performance across different devices and abilities

## 🤝 Contributing

This is an early-stage PoC. Feedback welcome on:
- Child user experience and accessibility
- Mathematical pedagogy and learning theory
- Technical performance and optimization
- Visual design and interaction patterns

## 📄 License

See LICENSE file for details.

---

**Built with ❤️ for young learners everywhere**

*Making math visual, intuitive, and joyful for children ages 5-10*
