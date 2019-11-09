newprandom = function(seed)
{
    return {
        seed:seed,
        random: function(max)
        {
            this.seed = (this.seed * 214013)  & 0xFFFFFFFF;
            if (this.seed<0)
                this.seed = 0x100000000+this.seed;
            this.seed = (this.seed+2531011)  & 0xFFFFFFFF;
            if (this.seed<0)
                this.seed = 0x100000000+this.seed;
            return (this.seed >>> 16) % (max + 1);
        },
    };
}
