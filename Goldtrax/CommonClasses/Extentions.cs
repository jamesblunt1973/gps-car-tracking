using System;

namespace Goldtrax
{
    public static class Extentions
    {
        public static string GetExceptionMessage(this Exception ex)
        {
            while (ex.InnerException != null)
                ex = ex.InnerException;
            return ex.Message;
        }
    }
}
