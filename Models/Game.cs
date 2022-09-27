namespace Minesweeper.Models
{
    public class Game
    {
        public string GameId { get; set; }
        public string Name { get; set; }
        public string Difficulty { get; set; }
        public int Score { get; set; }

        public bool isValid()
        {
            if(Name.Length == 3 && Score > 0) return true;
            return false;
        }

        public string toString()
        {
            return GameId + "/" + Name + "/" + Difficulty + "/" + Score;
        }
    }
}
