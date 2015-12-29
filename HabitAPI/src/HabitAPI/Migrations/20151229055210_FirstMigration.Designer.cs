using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Migrations;
using HabitAPI.DataAccess;

namespace HabitAPI.Migrations
{
    [DbContext(typeof(HabitAPIDBContext))]
    [Migration("20151229055210_FirstMigration")]
    partial class FirstMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0-rc1-16348");

            modelBuilder.Entity("HabitAPI.Models.Habit", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreatedAt");

                    b.Property<bool>("Deleted");

                    b.Property<int>("Interval");

                    b.Property<int>("Iteration");

                    b.Property<string>("Name");

                    b.HasKey("Id");
                });
        }
    }
}
