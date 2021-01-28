<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PublishBroadcastEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $_uuid;
    public $_date;
    public $_shift;
    public $_squadron;
    public $_model;
    public $data;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($uuid, $date, $shift, $squadron, $model, $data)
    {
        $this->_uuid = $uuid;
        $this->_date = $date;
        $this->_shift = $shift;
        $this->_squadron = $squadron;
        $this->_model = $model;
        
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('motherhood');
    }

    public function broadcastAs() 
    {
        return 'published';
    }

    public function broadcastWith()
    {
        $message = [
                    '_uuid' => $this->_uuid,
                    '_date' => $this->_date,
                    '_shift' => $this->_shift, 
                    '_squadron' => $this->_squadron,
                    '_model' => $this->_model,
                    'data' => $this->data,
                   ];


        //$out = new \Symfony\Component\Console\Output\ConsoleOutput();
        //$out->writeln("Output: ");
        //$out->writeln($message);

        return $message;
    }

}
