using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Minesweeper.Data;
using System;
using System.Linq;

namespace Minesweeper.Models
{
    public class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            DateTime now = DateTime.Now;
            using (var context = new MinesweeperContext(
                serviceProvider.GetRequiredService<DbContextOptions<MinesweeperContext>>()))
            {
                if (context.Game.Any()) { return; }
                context.Game.AddRange(
                    new Game
                    {
                        GameId = now.Year.ToString() + now.Month.ToString() + now.Day.ToString() + now.Minute.ToString() + now.Second.ToString() + "50",
                        Name = "ben",
                        Difficulty = "Beginner",
                        Score = 50,      
                    },
                    new Game
                    {
                        GameId = now.Year.ToString() + now.Month.ToString() + now.Day.ToString() + now.Minute.ToString() + now.Second.ToString() + "250",
                        Name = "cam",
                        Difficulty = "Intermediate",
                        Score = 250,
                    },
                    new Game
                    {
                        GameId = now.Year.ToString() + now.Month.ToString() + now.Day.ToString() + now.Minute.ToString() + now.Second.ToString() + "1500",
                        Name = "hzy",
                        Difficulty = "Expert",
                        Score = 1500,
                    }
                );
                context.SaveChanges();
            }
        }
    }
}
