using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HabitAPI.Models
{
    public class Habit
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Interval { get; set; }
        public int Iteration { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Deleted { get; set; }

    }
}
