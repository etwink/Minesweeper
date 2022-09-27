using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Minesweeper.Data;
using Minesweeper.Models;

namespace Minesweeper.Controllers
{
    public class GamesController : Controller
    {
        private readonly MinesweeperContext _context;

        public GamesController(MinesweeperContext context)
        {
            _context = context;
        }

        // GET: Games
        public async Task<IActionResult> Index(string difficulty)
        {
            Game game = new()
            {
                GameId = "",
                Name = "",
                Difficulty = difficulty,
                Score = 0
            };
            ViewData["Game"] = game;
            ViewData["HighScores"] = await _context.Game.Where(x => x.Difficulty == difficulty).OrderBy(x => x.Score).Take(5).ToListAsync();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> postHighScore(Game game)
        {
            DateTime now = DateTime.Now;
            string gameId = now.Year.ToString() + now.Month.ToString() + now.Day.ToString() + now.Minute.ToString() + now.Second.ToString() + game.Score.ToString();
            game.GameId = gameId;
            if (game.isValid())
            {
                _context.Add(game);
                await _context.SaveChangesAsync();
            }

            return Redirect("../Home/Index");
        }

        // GET: Games/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null || _context.Game == null)
            {
                return NotFound();
            }

            var game = await _context.Game
                .FirstOrDefaultAsync(m => m.GameId == id);
            if (game == null)
            {
                return NotFound();
            }

            return View(game);
        }

        // GET: Games/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Games/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,Difficulty,Score")] Game game)
        {
            if (ModelState.IsValid)
            {
                _context.Add(game);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(game);
        }

        // GET: Games/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null || _context.Game == null)
            {
                return NotFound();
            }

            var game = await _context.Game.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }
            return View(game);
        }

        // POST: Games/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("Id,Name,Difficulty,Score")] Game game)
        {
            if (id != game.GameId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(game);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GameExists(game.GameId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(game);
        }

        // GET: Games/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null || _context.Game == null)
            {
                return NotFound();
            }

            var game = await _context.Game
                .FirstOrDefaultAsync(m => m.GameId == id);
            if (game == null)
            {
                return NotFound();
            }

            return View(game);
        }

        // POST: Games/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            if (_context.Game == null)
            {
                return Problem("Entity set 'MinesweeperContext.Game'  is null.");
            }
            var game = await _context.Game.FindAsync(id);
            if (game != null)
            {
                _context.Game.Remove(game);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool GameExists(string id)
        {
          return _context.Game.Any(e => e.GameId == id);
        }
    }
}
