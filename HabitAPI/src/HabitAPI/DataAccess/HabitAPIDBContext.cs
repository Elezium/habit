using Microsoft.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HabitAPI.Models;
using Microsoft.Extensions.PlatformAbstractions;
using System.IO;

namespace HabitAPI.DataAccess
{
    public class HabitAPIDBContext : DbContext
    {
        public DbSet<Habit> Habits { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var path = PlatformServices.Default.Application.ApplicationBasePath;
            optionsBuilder.UseSqlite("Filename=" + Path.Combine(path, "habit.db"));
        }

    }
}
