import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, RotateCcw, Volume2, VolumeX, Plus, Sparkles, Bot, ShoppingCart } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { translations } from '../../i18n/translations';

interface Tile {
  x: number;
  y: number;
  type: 'soil' | 'tilled' | 'crop' | 'dock';
  crop?: 'carrot' | 'tomato' | 'corn' | 'wheat' | 'strawberry' | 'cabbage';
  stage: number; // 0: seed, 1: sprout, 2: growing, 3: ripe
  moisture: number; // 0 - 100
}

interface RobotEntity {
  id: string;
  name: string;
  x: number;
  y: number;
  targetX: number | null;
  targetY: number | null;
  state: 'idle' | 'walking' | 'watering' | 'harvesting' | 'charging';
  waterTank: number;
  actionTimer: number;
  facing: 'left' | 'right';
  hasBasket: boolean;
  basketX: number;
  basketY: number;
}

const GRID_COLS = 22;
const GRID_ROWS = 14;
const TILE_SIZE = 34;

export const PixelSimulation: React.FC<{ lang?: 'ru' | 'kz' | 'en' }> = ({ lang = 'ru' }) => {
  const tr = translations[lang] || translations.ru;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [timeHour, setTimeHour] = useState<number>(9);
  const [weather, setWeather] = useState<'sunny' | 'rain' | 'cloudy'>('sunny');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Selected tool
  const [selectedCrop, setSelectedCrop] = useState<'carrot' | 'tomato' | 'corn' | 'wheat' | 'strawberry' | 'cabbage'>('carrot');
  const [activeTool, setActiveTool] = useState<'plant' | 'till' | 'water' | 'robot'>('plant');

  // Harvest warehouse
  const [warehouse, setWarehouse] = useState<{ [key: string]: number }>({
    carrot: 42,
    tomato: 35,
    corn: 18,
    wheat: 80,
    strawberry: 24,
    cabbage: 15
  });

  // Drag selection
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);

  // Grid initialization
  const [grid, setGrid] = useState<Tile[][]>(() => {
    const initial: Tile[][] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      const row: Tile[] = [];
      for (let c = 0; c < GRID_COLS; c++) {
        // Dock station in top-left
        if (r < 2 && c < 2) {
          row.push({ x: c, y: r, type: 'dock', stage: 0, moisture: 100 });
        } else if (r >= 3 && r <= 10 && c >= 3 && c <= 18) {
          // pre-plant some carrots and tomatoes like in demo
          if (c < 10) {
            row.push({ x: c, y: r, type: 'crop', crop: 'carrot', stage: (r + c) % 4, moisture: 45 });
          } else {
            row.push({ x: c, y: r, type: 'crop', crop: 'tomato', stage: (r + c) % 4, moisture: 50 });
          }
        } else {
          row.push({ x: c, y: r, type: 'soil', stage: 0, moisture: 30 });
        }
      }
      initial.push(row);
    }
    return initial;
  });

  // Robots
  const [robots, setRobots] = useState<RobotEntity[]>([
    {
      id: 'egin-01',
      name: 'EGIN 01',
      x: 5,
      y: 6,
      targetX: null,
      targetY: null,
      state: 'idle',
      waterTank: 100,
      actionTimer: 0,
      facing: 'right',
      hasBasket: true,
      basketX: 4,
      basketY: 6
    },
    {
      id: 'egin-02',
      name: 'EGIN 02',
      x: 14,
      y: 7,
      targetX: null,
      targetY: null,
      state: 'idle',
      waterTank: 85,
      actionTimer: 0,
      facing: 'left',
      hasBasket: true,
      basketX: 15,
      basketY: 7
    }
  ]);

  // Sound toggle effect
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Main game tick
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      // Time advances
      setTimeHour(prev => {
        if (prev >= 21) {
          setDay(d => d + 1);
          // random weather change each day
          const wList: ('sunny' | 'rain' | 'cloudy')[] = ['sunny', 'sunny', 'rain', 'cloudy'];
          setWeather(wList[Math.floor(Math.random() * wList.length)]);
          return 6;
        }
        return prev + 1;
      });

      // Update plants growth and soil moisture
      setGrid(prevGrid => {
        return prevGrid.map(row =>
          row.map(tile => {
            let moisture = tile.moisture;
            if (weather === 'rain') {
              moisture = Math.min(100, moisture + 15);
            } else {
              moisture = Math.max(0, moisture - 2);
            }

            // Crop growth if watered
            let stage = tile.stage;
            if (tile.type === 'crop' && moisture > 25 && stage < 3) {
              if (Math.random() < 0.25) {
                stage = stage + 1;
              }
            }
            return { ...tile, moisture, stage };
          })
        );
      });

      // Autonomous Robot Behavior - Multi-agent task distribution
      setRobots(prevRobots => {
        // Collect tiles already targeted by other robots
        const claimedTargetKeys = new Set<string>();
        prevRobots.forEach(bot => {
          if (bot.targetX !== null && bot.targetY !== null && bot.state !== 'idle') {
            claimedTargetKeys.add(`${bot.targetX},${bot.targetY}`);
          }
        });

        return prevRobots.map((bot, botIdx) => {
          let updated = { ...bot };

          if (updated.state === 'watering' || updated.state === 'harvesting') {
            updated.actionTimer -= 1;
            if (updated.actionTimer <= 0) {
              updated.state = 'idle';
              updated.targetX = null;
              updated.targetY = null;
            }
            return updated;
          }

          // If idle, find best unclaimed work based on proximity and assigned sector
          if (updated.state === 'idle') {
            const ripeCandidates: { x: number; y: number; dist: number }[] = [];
            const dryCandidates: { x: number; y: number; dist: number }[] = [];

            for (let r = 0; r < GRID_ROWS; r++) {
              for (let c = 0; c < GRID_COLS; c++) {
                const key = `${c},${r}`;
                if (claimedTargetKeys.has(key)) continue;

                const t = grid[r][c];
                const dist = Math.hypot(c - updated.x, r - updated.y);

                if (t.type === 'crop' && t.stage === 3) {
                  ripeCandidates.push({ x: c, y: r, dist });
                } else if (t.type === 'crop' && t.moisture < 40) {
                  dryCandidates.push({ x: c, y: r, dist });
                }
              }
            }

            // Sort by distance to this robot
            ripeCandidates.sort((a, b) => a.dist - b.dist);
            dryCandidates.sort((a, b) => a.dist - b.dist);

            if (ripeCandidates.length > 0) {
              const target = ripeCandidates[0];
              updated.targetX = target.x;
              updated.targetY = target.y;
              updated.state = 'walking';
              claimedTargetKeys.add(`${target.x},${target.y}`);
            } else if (dryCandidates.length > 0) {
              const target = dryCandidates[0];
              updated.targetX = target.x;
              updated.targetY = target.y;
              updated.state = 'walking';
              claimedTargetKeys.add(`${target.x},${target.y}`);
            } else {
              // Patrol separate sectors: distribute by robot index
              const sectorCol = Math.floor(3 + ((GRID_COLS - 6) / Math.max(1, prevRobots.length)) * (botIdx + 0.5));
              const wanderX = Math.max(2, Math.min(GRID_COLS - 3, sectorCol + Math.floor((Math.random() - 0.5) * 4)));
              const wanderY = Math.max(3, Math.min(GRID_ROWS - 3, Math.floor(4 + Math.random() * 6)));
              updated.targetX = wanderX;
              updated.targetY = wanderY;
              updated.state = 'walking';
            }
          }

          // If walking towards target
          if (updated.state === 'walking' && updated.targetX !== null && updated.targetY !== null) {
            const dx = updated.targetX - updated.x;
            const dy = updated.targetY - updated.y;

            if (Math.abs(dx) <= 0.2 && Math.abs(dy) <= 0.2) {
              // Reached target tile!
              updated.x = updated.targetX;
              updated.y = updated.targetY;
              const targetTile = grid[updated.y]?.[updated.x];

              if (targetTile && targetTile.type === 'crop' && targetTile.stage === 3) {
                // Harvest action!
                updated.state = 'harvesting';
                updated.actionTimer = 2;
                sounds.playHarvest();
                const cropType = targetTile.crop || 'carrot';
                setWarehouse(w => ({ ...w, [cropType]: (w[cropType] || 0) + 1 }));
                setGrid(g => {
                  const copy = g.map(row => [...row]);
                  copy[updated.y][updated.x] = { ...copy[updated.y][updated.x], stage: 0 };
                  return copy;
                });
              } else if (targetTile && targetTile.type === 'crop' && targetTile.moisture < 50) {
                // Watering action!
                updated.state = 'watering';
                updated.actionTimer = 2;
                sounds.playWater();
                setGrid(g => {
                  const copy = g.map(row => [...row]);
                  copy[updated.y][updated.x] = { ...copy[updated.y][updated.x], moisture: 95 };
                  return copy;
                });
              } else {
                updated.state = 'idle';
              }
            } else {
              // Step towards target
              const step = 0.35 * speed;
              const stepX = Math.sign(dx) * Math.min(Math.abs(dx), step);
              const stepY = Math.sign(dy) * Math.min(Math.abs(dy), step);
              if (Math.abs(stepX) > 0) {
                updated.facing = stepX > 0 ? 'right' : 'left';
              }
              // Basket follows behind
              updated.basketX = updated.x;
              updated.basketY = updated.y;
              updated.x += stepX;
              updated.y += stepY;
            }
          }

          return updated;
        });
      });
    }, 600 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, weather, grid]);

  // Apply user action on tile
  const handleApplyToolToTile = (col: number, row: number) => {
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return;
    sounds.playPlant();

    setGrid(prev => {
      const next = prev.map(r => [...r]);
      const tile = next[row][col];
      if (tile.type === 'dock') return next;

      if (activeTool === 'plant') {
        next[row][col] = {
          ...tile,
          type: 'crop',
          crop: selectedCrop,
          stage: 0,
          moisture: 75
        };
      } else if (activeTool === 'till') {
        next[row][col] = {
          ...tile,
          type: 'soil',
          stage: 0,
          moisture: 20
        };
      } else if (activeTool === 'water') {
        sounds.playWater();
        next[row][col] = {
          ...tile,
          moisture: 100
        };
      }
      return next;
    });
  };

  // Add a new EGIN robot
  const handleAddRobot = () => {
    sounds.playClick();
    const newId = `egin-0${robots.length + 1}`;
    setRobots(prev => [
      ...prev,
      {
        id: newId,
        name: `EGIN 0${robots.length + 1}`,
        x: 1,
        y: 1,
        targetX: 5 + Math.floor(Math.random() * 8),
        targetY: 5 + Math.floor(Math.random() * 5),
        state: 'idle',
        waterTank: 100,
        actionTimer: 0,
        facing: 'right',
        hasBasket: true,
        basketX: 0,
        basketY: 1
      }
    ]);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
  };

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Background grass
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle checkered grass pattern
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if ((r + c) % 2 === 0) {
          ctx.fillStyle = '#264e21';
          ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // Draw tiles
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const tile = grid[r][c];
        const px = c * TILE_SIZE;
        const py = r * TILE_SIZE;

        if (tile.type === 'dock') {
          // Charging dock
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.fillStyle = '#10b981';
          ctx.fillRect(px + 8, py + 8, TILE_SIZE - 16, TILE_SIZE - 16);
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          ctx.fillText('⚡DOCK', px + 4, py + 20);
        } else if (tile.type === 'crop' || tile.type === 'tilled') {
          // Brown soil bed with wooden border
          const soilColor = tile.moisture > 40 ? '#452b14' : '#6e4722';
          ctx.fillStyle = soilColor;
          ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);

          // Moisture bar indicator at bottom of tile
          ctx.fillStyle = '#0284c7';
          const moistW = Math.max(2, ((TILE_SIZE - 6) * tile.moisture) / 100);
          ctx.fillRect(px + 3, py + TILE_SIZE - 5, moistW, 3);

          // Draw Crop Sprite
          if (tile.type === 'crop' && tile.crop) {
            drawPixelCrop(ctx, px, py, tile.crop, tile.stage);
          }
        }
      }
    }

    // Draw Selection Box if dragging
    if (isMouseDown && dragStart && dragCurrent) {
      const minX = Math.min(dragStart.x, dragCurrent.x);
      const maxX = Math.max(dragStart.x, dragCurrent.x);
      const minY = Math.min(dragStart.y, dragCurrent.y);
      const maxY = Math.max(dragStart.y, dragCurrent.y);

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(
        minX * TILE_SIZE,
        minY * TILE_SIZE,
        (maxX - minX + 1) * TILE_SIZE,
        (maxY - minY + 1) * TILE_SIZE
      );
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.fillRect(
        minX * TILE_SIZE,
        minY * TILE_SIZE,
        (maxX - minX + 1) * TILE_SIZE,
        (maxY - minY + 1) * TILE_SIZE
      );
      ctx.setLineDash([]);
    }

    // Draw Robots and Follow-Me Baskets
    robots.forEach(bot => {
      // Draw Follow-Me Basket behind
      if (bot.hasBasket) {
        drawPixelBasket(ctx, bot.basketX * TILE_SIZE, bot.basketY * TILE_SIZE);
      }

      // Draw EGIN Humanoid Robot
      drawPixelRobot(ctx, bot.x * TILE_SIZE, bot.y * TILE_SIZE, bot.facing, bot.state);

      // Water spray particles animation
      if (bot.state === 'watering') {
        ctx.fillStyle = '#38bdf8';
        const sprayX = bot.facing === 'right' ? (bot.x + 0.8) * TILE_SIZE : (bot.x - 0.2) * TILE_SIZE;
        const sprayY = (bot.y + 0.5) * TILE_SIZE;
        for (let i = 0; i < 6; i++) {
          const offsetX = (Math.random() - 0.5) * 12;
          const offsetY = Math.random() * 14;
          ctx.fillRect(sprayX + offsetX, sprayY + offsetY, 3, 3);
        }
      }

      // Harvest sparkles
      if (bot.state === 'harvesting') {
        ctx.fillStyle = '#facc15';
        const sparkX = (bot.x + 0.5) * TILE_SIZE;
        const sparkY = (bot.y + 0.4) * TILE_SIZE;
        ctx.fillRect(sparkX - 6 + Math.random() * 12, sparkY - 6 + Math.random() * 12, 4, 4);
      }
    });

    // Rain effect overlay
    if (weather === 'rain') {
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 40; i++) {
        const rx = Math.random() * canvas.width;
        const ry = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 4, ry + 12);
        ctx.stroke();
      }
    }
  }, [grid, robots, isMouseDown, dragStart, dragCurrent, weather]);

  // Pixel Crop Drawing Helper
  const drawPixelCrop = (
    ctx: CanvasRenderingContext2D,
    px: number,
    py: number,
    crop: string,
    stage: number
  ) => {
    const cx = px + TILE_SIZE / 2;
    const cy = py + TILE_SIZE / 2 + 2;

    if (stage === 0) {
      // Seed / tiny sprout
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(cx - 2, cy + 2, 4, 4);
      return;
    }
    if (stage === 1) {
      // Young green seedling
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(cx - 2, cy - 2, 4, 8);
      ctx.fillRect(cx - 6, cy - 4, 4, 3);
      ctx.fillRect(cx + 2, cy - 4, 4, 3);
      return;
    }

    // Growing or Ripe
    if (crop === 'carrot') {
      ctx.fillStyle = '#15803d'; // leaves
      ctx.fillRect(cx - 4, cy - 10, 8, 6);
      ctx.fillStyle = '#f97316'; // orange carrot root
      ctx.fillRect(cx - 3, cy - 4, 6, stage === 3 ? 12 : 8);
      ctx.fillRect(cx - 1, cy + 6, 2, 4);
    } else if (crop === 'tomato') {
      ctx.fillStyle = '#166534'; // stem
      ctx.fillRect(cx - 2, cy - 12, 4, 14);
      ctx.fillStyle = stage === 3 ? '#ef4444' : '#84cc16'; // tomato fruit
      ctx.beginPath();
      ctx.arc(cx - 4, cy - 2, stage === 3 ? 5 : 3.5, 0, Math.PI * 2);
      ctx.arc(cx + 4, cy, stage === 3 ? 5.5 : 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (crop === 'corn') {
      ctx.fillStyle = '#15803d'; // tall stalk
      ctx.fillRect(cx - 3, cy - 14, 6, 18);
      ctx.fillStyle = stage === 3 ? '#eab308' : '#84cc16'; // yellow cob
      ctx.fillRect(cx - 1, cy - 8, 4, 10);
    } else if (crop === 'wheat') {
      ctx.fillStyle = stage === 3 ? '#d97706' : '#65a30d'; // golden wheat
      ctx.fillRect(cx - 2, cy - 14, 4, 18);
      ctx.fillRect(cx - 5, cy - 12, 3, 4);
      ctx.fillRect(cx + 2, cy - 10, 3, 4);
      ctx.fillRect(cx - 5, cy - 6, 3, 4);
    } else if (crop === 'strawberry') {
      ctx.fillStyle = '#166534'; // leaves
      ctx.fillRect(cx - 6, cy - 4, 12, 4);
      ctx.fillStyle = stage === 3 ? '#e11d48' : '#a3e635'; // berry
      ctx.beginPath();
      ctx.arc(cx, cy + 2, stage === 3 ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (crop === 'cabbage') {
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(cx, cy, stage === 3 ? 9 : 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.arc(cx, cy, stage === 3 ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Pixel EGIN Humanoid Robot Drawing
  const drawPixelRobot = (
    ctx: CanvasRenderingContext2D,
    rx: number,
    ry: number,
    facing: 'left' | 'right',
    state: string
  ) => {
    const cx = rx + TILE_SIZE / 2;
    const cy = ry + TILE_SIZE / 2;

    // Robot shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 14, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (White with dark plates)
    ctx.fillStyle = '#f8fafc'; // glossy white
    ctx.fillRect(cx - 6, cy - 4, 12, 12);
    ctx.fillStyle = '#1e293b'; // dark harness
    ctx.fillRect(cx - 4, cy - 2, 8, 8);

    // Kazakh Ornament Gold Badge on Shoulder
    ctx.fillStyle = '#eab308';
    ctx.fillRect(cx - 5, cy - 3, 2, 2);
    ctx.fillRect(cx + 3, cy - 3, 2, 2);

    // Legs
    ctx.fillStyle = '#334155';
    ctx.fillRect(cx - 5, cy + 8, 4, 6);
    ctx.fillRect(cx + 1, cy + 8, 4, 6);

    // Feet
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 6, cy + 13, 5, 2);
    ctx.fillRect(cx + 1, cy + 13, 5, 2);

    // Head / Helmet (White with Visor)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 7, cy - 16, 14, 11);
    ctx.fillStyle = '#0f172a'; // black visor
    ctx.fillRect(facing === 'right' ? cx - 3 : cx - 6, cy - 13, 8, 5);

    // Glowing Cyan Visor Eyes
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(facing === 'right' ? cx : cx - 4, cy - 12, 3, 2);

    // Green Sprout Antenna 🌱 on Helmet! (Distinctive EGIN feature)
    ctx.fillStyle = '#10b981';
    ctx.fillRect(cx - 1, cy - 19, 2, 4);
    ctx.fillRect(cx - 4, cy - 22, 3, 3);
    ctx.fillRect(cx + 1, cy - 22, 3, 3);

    // Hands
    ctx.fillStyle = '#cbd5e1';
    if (state === 'watering') {
      // Right hand extended with spray hose
      const handX = facing === 'right' ? cx + 7 : cx - 12;
      ctx.fillRect(handX, cy + 2, 6, 4);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(handX + (facing === 'right' ? 5 : -2), cy + 3, 3, 2);
    } else {
      ctx.fillRect(cx - 8, cy - 1, 3, 8);
      ctx.fillRect(cx + 5, cy - 1, 3, 8);
    }

    // Name tag above robot
    ctx.fillStyle = '#10b981';
    ctx.font = '8px monospace';
    ctx.fillText('EGIN', cx - 9, cy - 24);
  };

  // Pixel Follow-Me Basket Drawing
  const drawPixelBasket = (ctx: CanvasRenderingContext2D, bx: number, by: number) => {
    const cx = bx + TILE_SIZE / 2;
    const cy = by + TILE_SIZE / 2;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 12, 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Cart Body
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(cx - 8, cy + 1, 16, 9);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 7, cy + 3, 14, 5);

    // Compartment contents (berries, carrots)
    ctx.fillStyle = '#ef4444'; // red berries
    ctx.fillRect(cx - 5, cy + 4, 3, 3);
    ctx.fillStyle = '#f97316'; // carrots
    ctx.fillRect(cx - 1, cy + 4, 3, 3);
    ctx.fillStyle = '#eab308'; // corn
    ctx.fillRect(cx + 3, cy + 4, 3, 3);

    // Wheels
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx - 8, cy + 9, 3, 3);
    ctx.fillRect(cx + 5, cy + 9, 3, 3);

    // Mini green sprout flag on basket
    ctx.fillStyle = '#10b981';
    ctx.fillRect(cx + 5, cy - 5, 1, 6);
    ctx.fillRect(cx + 6, cy - 5, 3, 2);
  };

  // Mouse & Touch Handlers with Responsive Scaling
  const getCanvasClientCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { col: 0, row: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    return { 
      col: Math.max(0, Math.min(GRID_COLS - 1, col)), 
      row: Math.max(0, Math.min(GRID_ROWS - 1, row)) 
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { col, row } = getCanvasClientCoords(e.clientX, e.clientY);
    setIsMouseDown(true);
    setDragStart({ x: col, y: row });
    setDragCurrent({ x: col, y: row });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown) return;
    const { col, row } = getCanvasClientCoords(e.clientX, e.clientY);
    setDragCurrent({ x: col, y: row });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const { col, row } = getCanvasClientCoords(touch.clientX, touch.clientY);
      setIsMouseDown(true);
      setDragStart({ x: col, y: row });
      setDragCurrent({ x: col, y: row });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isMouseDown || e.touches.length === 0) return;
    const touch = e.touches[0];
    const { col, row } = getCanvasClientCoords(touch.clientX, touch.clientY);
    setDragCurrent({ x: col, y: row });
  };

  const handleMouseUp = () => {
    if (isMouseDown && dragStart && dragCurrent) {
      const minX = Math.min(dragStart.x, dragCurrent.x);
      const maxX = Math.max(dragStart.x, dragCurrent.x);
      const minY = Math.min(dragStart.y, dragCurrent.y);
      const maxY = Math.max(dragStart.y, dragCurrent.y);

      // Apply tool across selected rectangle
      for (let r = minY; r <= maxY; r++) {
        for (let c = minX; c <= maxX; c++) {
          handleApplyToolToTile(c, r);
        }
      }
    }
    setIsMouseDown(false);
    setDragStart(null);
    setDragCurrent(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl text-slate-100 font-sans">
      {/* Simulation Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              EGIN Pixel Farm Simulator
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest font-mono">
                Live Engine
              </span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Выделите поле мышкой, посадите культуры, запустите роботов EGIN с ладонным поливом и корзиной Follow-Me!
          </p>
        </div>

        {/* Top Controls: Day, Weather, Speed, Sound */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          {/* Day & Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-lg text-xs font-mono text-emerald-300 border border-slate-700">
            <span>📅 День {day}</span>
            <span className="text-slate-500">|</span>
            <span>🕒 {timeHour.toString().padStart(2, '0')}:00</span>
          </div>

          {/* Weather badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 rounded-lg text-xs font-medium text-slate-300 border border-slate-700">
            {weather === 'sunny' && <span>☀️ Солнечно (+24°C)</span>}
            {weather === 'rain' && <span className="text-sky-300">🌧️ Дождь (+18°C)</span>}
            {weather === 'cloudy' && <span>⛅ Облачно (+21°C)</span>}
          </div>

          {/* Speed Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1.5 rounded-md transition ${isPlaying ? 'bg-amber-600/30 text-amber-300' : 'bg-emerald-600 text-white'}`}
              title={isPlaying ? 'Пауза' : 'Старт'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSpeed(1)}
              className={`px-2 py-1 text-xs rounded transition font-mono ${speed === 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              1x
            </button>
            <button
              onClick={() => setSpeed(2)}
              className={`px-2 py-1 text-xs rounded transition font-mono ${speed === 2 ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              2x
            </button>
            <button
              onClick={() => setSpeed(4)}
              className={`px-2 py-1 text-xs rounded transition font-mono ${speed === 4 ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              4x
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition ${soundEnabled ? 'bg-slate-800 text-emerald-400 border-slate-700' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
            title="Звуковые эффекты симуляции"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Warehouse Harvest Counters */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-lg">🥕</span>
          <div>
            <div className="text-slate-400">{tr.simCropCarrot}</div>
            <div className="font-bold text-emerald-400 font-mono">{warehouse.carrot} {lang === 'en' ? 'kg' : 'кг'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🍅</span>
          <div>
            <div className="text-slate-400">{tr.simCropTomato}</div>
            <div className="font-bold text-emerald-400 font-mono">{warehouse.tomato} {lang === 'en' ? 'kg' : 'кг'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🌽</span>
          <div>
            <div className="text-slate-400">{tr.simCropCorn}</div>
            <div className="font-bold text-emerald-400 font-mono">{warehouse.corn} {lang === 'en' ? 'kg' : 'кг'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🌾</span>
          <div>
            <div className="text-slate-400">{tr.simCropWheat}</div>
            <div className="font-bold text-emerald-400 font-mono">{warehouse.wheat} {lang === 'en' ? 'kg' : 'кг'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🍓</span>
          <div>
            <div className="text-slate-400">{tr.simCropStrawberry}</div>
            <div className="font-bold text-emerald-400 font-mono">{warehouse.strawberry} {lang === 'en' ? 'kg' : 'кг'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🥬</span>
          <div>
            <div className="text-slate-400">{tr.simCropCabbage}</div>
            <div className="font-bold text-emerald-400 font-mono">{warehouse.cabbage} {lang === 'en' ? 'kg' : 'кг'}</div>
          </div>
        </div>
      </div>

      {/* Interactive Tool Palette */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
        {/* Tool modes */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { sounds.playClick(); setActiveTool('plant'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${activeTool === 'plant' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <span>🌱</span> {tr.simToolPlant}
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTool('water'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${activeTool === 'water' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <span>💧</span> {tr.simToolWater}
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTool('till'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${activeTool === 'till' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <span>🧹</span> {tr.simToolTill}
          </button>
        </div>

        {/* Crop Selection */}
        {activeTool === 'plant' && (
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'carrot', icon: '🥕', label: tr.simCropCarrot },
              { id: 'tomato', icon: '🍅', label: tr.simCropTomato },
              { id: 'corn', icon: '🌽', label: tr.simCropCorn },
              { id: 'wheat', icon: '🌾', label: tr.simCropWheat },
              { id: 'strawberry', icon: '🍓', label: tr.simCropStrawberry },
              { id: 'cabbage', icon: '🥬', label: tr.simCropCabbage }
            ].map(c => (
              <button
                key={c.id}
                onClick={() => { sounds.playClick(); setSelectedCrop(c.id as any); }}
                className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1 transition ${selectedCrop === c.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'text-slate-400 hover:text-white'}`}
                title={c.label}
              >
                <span>{c.icon}</span>
                <span className="hidden sm:inline">{c.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Add Robot Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddRobot}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition transform active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>+ {tr.simRobotBtn} ({robots.length})</span>
          </button>
        </div>
      </div>

      {/* Simulation Canvas Container */}
      <div className="relative overflow-x-auto rounded-xl border-2 border-slate-800 bg-slate-950 flex justify-center p-2 max-w-full">
        <canvas
          ref={canvasRef}
          width={GRID_COLS * TILE_SIZE}
          height={GRID_ROWS * TILE_SIZE}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          style={{ touchAction: 'none' }}
          className="cursor-crosshair rounded-lg shadow-2xl block max-w-full h-auto"
        />

        {/* Quick Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block"></span> {tr.simLegendMoisture}</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span> {tr.simLegendOrnament}</span>
          <span className="flex items-center gap-1">🌱 {tr.simLegendSprout}</span>
          <span className="flex items-center gap-1">🛒 {tr.simLegendBasket}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div>
          💡 <span className="text-slate-300 font-medium">{lang === 'en' ? 'Tip' : lang === 'kz' ? 'Кеңес' : 'Подсказка'}:</span> {lang === 'en' ? 'Hold left mouse button and drag a rectangle to plant an entire row at once!' : lang === 'kz' ? 'Тышқанның сол жақ батырмасын басып ұстаңыз және бүкіл жүйекке тұқым себу үшін төртбұрышты созыңыз!' : 'Зажмите левую кнопку мыши и растяните прямоугольник, чтобы засеять сразу целую грядку!'}
        </div>
        <div className="font-mono text-emerald-400">
          {tr.simActiveRobots}: {robots.length} | {tr.simAllSystems}
        </div>
      </div>
    </div>
  );
};
