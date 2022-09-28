using Microsoft.AspNetCore.Mvc;
using Minesweeper.Models;
using Minesweeper.Data;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace Minesweeper.Controllers
{
    public class HomeController : Controller
    {
        private readonly MinesweeperContext _context;

        public HomeController(MinesweeperContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["Beginner"] = await _context.Game.Where(x => x.Difficulty == "Beginner").OrderBy(x => x.Score).Take(5).ToListAsync();
            ViewData["Intermediate"] = await _context.Game.Where(x => x.Difficulty == "Intermediate").OrderBy(x => x.Score).Take(5).ToListAsync();
            ViewData["Expert"] = await _context.Game.Where(x => x.Difficulty == "Expert").OrderBy(x => x.Score).Take(5).ToListAsync();
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}