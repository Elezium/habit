using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using HabitAPI.Models;
using HabitAPI.DataAccess;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace HabitAPI.Controllers
{
    /// <summary>
    /// This class is used as an API to get the habit.
    /// </summary>
    [Route("api/[controller]")]
    public class HabitsController : Controller
    {

        HabitAPIDBContext _db = new HabitAPIDBContext();

        /// <summary>
        /// This method returns all the habits
        /// </summary>        
        /// <returns>All habits found in the database</returns>
        [HttpGet]
        public IEnumerable<Habit> Get()
        {
            return _db.Habits.ToArray();
        }

        /// <summary>
        /// This method returns only one (1) habit specified by the id
        /// </summary>
        /// <param name="id">id of the habit</param>
        /// <returns>One (1) habit</returns>
        [HttpGet("{id}")]
        public Habit Get(int id)
        {
            return _db.Habits.Where(x => x.Id == id).FirstOrDefault();
        }

        /// <summary>
        /// This method ADD a habit.  Habit object must be in the body of the request in JSON
        /// </summary>
        /// <returns>Nothing for now</returns>
        [HttpPost]
        public void Post([FromBody]Habit habit)
        {
            //Check if model is valid.
            habit.CreatedAt = DateTime.Now;
            _db.Habits.Add(habit);
            _db.SaveChanges();
        }

        /// <summary>
        /// This method UPDATE a habit specfied by the ID.  Habit object must be in the body of the request in JSON
        /// You can provide only the field(s) to be updated.
        /// </summary>
        /// <param name="id">id of the habit</param>
        /// <returns>Nothing for now</returns>
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]Habit habit)
        {
            var tempHabit = _db.Habits.Where(x => x.Id == id).SingleOrDefault();
            // Set y to the value of x if x is NOT null; otherwise,
            // if x = null, set y to -1.

            tempHabit.Interval = habit.Interval;
            tempHabit.Iteration = habit.Iteration;
            tempHabit.Name = habit.Name;
            _db.Habits.Update(tempHabit);
            _db.SaveChanges();

            
        }

        /// <summary>
        /// This method DELETE a habit specfied by the ID. 
        /// </summary>        
        /// <param name="id">id of the habit</param>
        /// <returns>Nothing for now</returns>
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var tempHabit = _db.Habits.Where(x => x.Id == id).SingleOrDefault();
            _db.Habits.Remove(tempHabit);
            _db.SaveChanges();
        }
    }
}
