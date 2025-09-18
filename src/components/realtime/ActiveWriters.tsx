import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Edit3, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface ActiveWriter {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  last_seen: string;
}

const ActiveWriters = () => {
  const [activeWriters, setActiveWriters] = useState<ActiveWriter[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const updateWriterActivity = async () => {
      if (user) {
        try {
          await supabase.rpc('update_writer_activity', {
            user_id: user.id,
            display_name: user.name,
            avatar_url: user.avatar
          });
        } catch (error) {
          console.error('Error updating writer activity:', error);
        }
      }
    };

    const fetchActiveWriters = async () => {
      try {
        const { data, error } = await supabase
          .from('active_writers')
          .select('*')
          .gt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString())
          .order('last_seen', { ascending: false });

        if (error) throw error;
        setActiveWriters(data || []);
        setIsVisible((data || []).length > 0);
      } catch (error) {
        console.error('Error fetching active writers:', error);
      }
    };

    // Initial fetch and activity update
    fetchActiveWriters();
    if (user) {
      updateWriterActivity();
    }

    // Set up real-time subscription
    const channel = supabase
      .channel('active-writers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_writers'
        },
        () => {
          fetchActiveWriters();
        }
      )
      .subscribe();

    // Update activity every 30 seconds
    const activityInterval = setInterval(() => {
      if (user) {
        updateWriterActivity();
      }
    }, 30000);

    // Cleanup inactive writers every 2 minutes
    const cleanupInterval = setInterval(async () => {
      try {
        await supabase.rpc('cleanup_inactive_writers');
      } catch (error) {
        console.error('Error cleaning up inactive writers:', error);
      }
    }, 120000);

    return () => {
      clearInterval(activityInterval);
      clearInterval(cleanupInterval);
      clearTimeout(timeoutId);
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!isVisible || activeWriters.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Edit3 className="w-4 h-4 text-white" />
          </div>
          Active Writers
          <Badge variant="secondary" className="ml-auto">
            {activeWriters.length} online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeWriters.slice(0, 6).map((writer) => (
          <div key={writer.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={writer.avatar_url || ''} alt={writer.display_name} />
                <AvatarFallback className="text-xs">
                  {writer.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {writer.display_name}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(writer.last_seen), { addSuffix: true })}
                </span>
              </div>
            </div>
            
            {writer.user_id === user?.id && (
              <Badge variant="outline" className="text-xs">
                You
              </Badge>
            )}
          </div>
        ))}
        
        {activeWriters.length > 6 && (
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              +{activeWriters.length - 6} more writers online
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>Writers are automatically tracked when active</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveWriters;