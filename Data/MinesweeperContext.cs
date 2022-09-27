using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Minesweeper.Models;

namespace Minesweeper.Data
{
    public class MinesweeperContext : DbContext
    {
        public MinesweeperContext (DbContextOptions<MinesweeperContext> options)
            : base(options)
        {
        }

        public DbSet<Minesweeper.Models.Game> Game { get; set; } = default!;
    }
}
