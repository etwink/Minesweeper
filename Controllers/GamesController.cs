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
            string gameId = now.Year.ToString() + now.Month.ToString() + now.Day.ToString() + now.Minute.ToString() + now.Second.ToString() + game.Score.ToString(); //date(12 char) + score(<6 char)
            if (gameId.Length > 18) { gameId = gameId.Substring(0, 19); }
            game.GameId = gameId;
            if (game.isValid())
            {
                _context.Add(game);
                await _context.SaveChangesAsync();
            }

            return Redirect("../Home/Index");
        }

    }
}
