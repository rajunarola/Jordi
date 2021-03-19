using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SocialEcommerce.Data.Repository
{

    public interface IStoredProcedureRepositoryBase
    {
        Task<DataSet> GetQueryDatatableAsync(string sqlQuery, SqlParameter[] sqlParam = null, CommandType type = CommandType.StoredProcedure);
        List<T> CreateListFromTable<T>(DataTable tbl) where T : new();
    }

    public class StoredProcedureRepositoryBase : IStoredProcedureRepositoryBase
    {
        private ApplicationDbContext _context;

        public StoredProcedureRepositoryBase(ApplicationDbContext context)
        {
            _context = context;
        }

        public static DataTable ToDataTable<T>(List<T> items)
        {
            var dataTable = new DataTable(typeof(T).Name);
            var props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (var prop in props)
            {
                dataTable.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            }

            foreach (T item in items)
            {
                var values = new object[props.Length];
                for (var i = 0; i < props.Length; i++)
                {
                    values[i] = props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            return dataTable;
        }

        public async Task<DataSet> GetQueryDatatableAsync(string sqlQuery, SqlParameter[] sqlParam = null, CommandType type = CommandType.StoredProcedure)
        {
            try
            {
                using (DbCommand cmd = this._context.Database.GetDbConnection().CreateCommand())
                {
                    cmd.Connection = this._context.Database.GetDbConnection();
                    cmd.CommandType = type;
                    if (sqlParam != null)
                    { cmd.Parameters.AddRange(sqlParam); }
                    cmd.CommandText = sqlQuery;
                    // cmd.Transaction = GetActiveTransaction();
                    using (DbDataAdapter dataAdapter = new SqlDataAdapter())
                    {
                        dataAdapter.SelectCommand = cmd;
                        DataSet ds = new DataSet();
                        await Task.Run(() => dataAdapter.Fill(ds));
                        return ds;
                    }
                }
            }
            catch (Exception ex)
            {
                var msg = ex;
                throw new NotImplementedException();
            }

        }

        public List<T> CreateListFromTable<T>(DataTable tbl) where T : new()
        {
            // define return list
            List<T> lst = new List<T>();

            // go through each row
            foreach (DataRow r in tbl.Rows)
            {
                // add to the list
                lst.Add(CreateItemFromRow<T>(r));
            }

            // return the list
            return lst;
        }

        // function that creates an object from the given data row
        public T CreateItemFromRow<T>(DataRow row) where T : new()
        {
            // create a new object
            T item = new T();

            // set the item
            SetItemFromRow(item, row);

            // return 
            return item;
        }

        public void SetItemFromRow<T>(T item, DataRow row) where T : new()
        {
            // go through each column
            foreach (DataColumn c in row.Table.Columns)
            {
                // find the property for the column
                PropertyInfo p = item.GetType().GetProperty(c.ColumnName);

                // if exists, set the value
                if (p != null && row[c] != DBNull.Value)
                {
                    p.SetValue(item, row[c], null);
                }
            }
        }
    }
}
